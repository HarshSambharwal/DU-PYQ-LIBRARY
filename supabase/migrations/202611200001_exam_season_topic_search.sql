-- Additive and inactive on installation. Only a trusted database owner stages/activates a release.
BEGIN;

CREATE TABLE public.topic_search_release_snapshots (
  release_key text PRIMARY KEY CHECK (release_key ~ '^exam-season-[a-z0-9-]{1,57}$'),
  payload_text text NOT NULL CHECK (octet_length(payload_text) BETWEEN 1 AND 16777216),
  payload_sha256 text NOT NULL CHECK (payload_sha256 = pg_catalog.encode(pg_catalog.sha256(
    pg_catalog.convert_to(payload_text, 'UTF8')), 'hex')),
  is_active boolean NOT NULL DEFAULT false,
  owner_decision_ref text,
  suggestion_decision_ref text,
  activated_at timestamptz,
  CHECK (NOT is_active OR (owner_decision_ref IS NOT NULL AND btrim(owner_decision_ref) <> '' AND activated_at IS NOT NULL))
);

CREATE UNIQUE INDEX topic_search_one_active_release
  ON public.topic_search_release_snapshots (is_active) WHERE is_active;

CREATE FUNCTION public.validate_topic_search_snapshot()
RETURNS trigger LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  body jsonb;
  hybrid boolean;
  allowed_keys CONSTANT text[] := ARRAY[
    'publication_eligible','import_key','mapping_id','question_id','question_version_id','question_ref',
    'question_text','paper_id','paper_title','course','semester','subject','category','year','pdf_url',
    'page_start','page_end','source_pages','paper_page_count','question_content_sha256',
    'syllabus_version_id','topic_id','topic_label','unit_label'
  ];
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.release_key IS DISTINCT FROM OLD.release_key OR NEW.payload_text IS DISTINCT FROM OLD.payload_text THEN
      RAISE EXCEPTION 'A staged Topic Search snapshot is immutable';
    END IF;
  END IF;
  IF NOT NEW.is_active THEN
    RETURN NEW;
  END IF;
  body := NEW.payload_text::jsonb;
  hybrid := body->'format_version' IS NOT DISTINCT FROM '3'::jsonb
    AND body->>'source' IS NOT DISTINCT FROM 'dupyq-exam-season-hybrid';
  IF jsonb_typeof(body) IS DISTINCT FROM 'object'
       OR COALESCE(body->>'storage_host', '') !~ '^[a-z0-9]+[.]supabase[.]co$'
       OR jsonb_typeof(body->'results') IS DISTINCT FROM 'array'
       OR (hybrid AND (jsonb_typeof(body->'suggestions') IS DISTINCT FROM 'array'
           OR body - ARRAY['format_version','source','storage_host','results','suggestions'] <> '{}'::jsonb))
       OR (NOT hybrid AND (body->'format_version' IS DISTINCT FROM '2'::jsonb
           OR body->>'source' IS DISTINCT FROM 'dupyq-approved-offline-export'
           OR body - ARRAY['format_version','source','storage_host','results'] <> '{}'::jsonb)) THEN
    RAISE EXCEPTION 'Invalid Topic Search export envelope';
  END IF;
  IF hybrid AND (nullif(btrim(NEW.suggestion_decision_ref), '') IS NULL
       OR btrim(NEW.suggestion_decision_ref) = btrim(NEW.owner_decision_ref)) THEN
    RAISE EXCEPTION 'A distinct explicit owner decision is required for the hybrid suggestion tier';
  END IF;
  IF jsonb_array_length(body->'results') + jsonb_array_length(COALESCE(body->'suggestions', '[]'::jsonb)) = 0 THEN
    RAISE EXCEPTION 'An empty Topic Search snapshot cannot be activated';
  END IF;
  IF EXISTS (
    WITH entries AS (
      SELECT entry FROM jsonb_array_elements(body->'results' || COALESCE(body->'suggestions', '[]'::jsonb)) AS rows(entry)
    )
    SELECT 1 FROM entries GROUP BY entry->>'mapping_id' HAVING count(*) > 1
    UNION ALL
    SELECT 1 FROM entries GROUP BY entry->>'question_id', entry->>'topic_id' HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate Topic Search mapping in the snapshot';
  END IF;
  IF EXISTS (
    SELECT 1 FROM (
      SELECT row, true AS approved_tier FROM jsonb_array_elements(body->'results') AS verified(row)
      UNION ALL
      SELECT row, false FROM jsonb_array_elements(COALESCE(body->'suggestions', '[]'::jsonb)) AS suggestions(row)
    ) AS item
    WHERE item.row->'publication_eligible' IS DISTINCT FROM to_jsonb(item.approved_tier)
       OR NOT (item.row ?& allowed_keys)
       OR (item.approved_tier AND item.row - allowed_keys <> '{}'::jsonb)
       OR (NOT item.approved_tier AND (
           item.row - (allowed_keys || ARRAY['related_parts']) <> '{}'::jsonb
           OR jsonb_typeof(item.row->'related_parts') IS DISTINCT FROM 'array'
           OR jsonb_array_length(item.row->'related_parts') > 12
           OR EXISTS (SELECT 1 FROM jsonb_array_elements(item.row->'related_parts') AS parts(text_value)
               WHERE jsonb_typeof(parts.text_value) <> 'string' OR btrim(parts.text_value #>> '{}') = '')
       ))
       OR nullif(btrim(item.row->>'question_text'), '') IS NULL
       OR item.row->>'question_content_sha256' IS DISTINCT FROM
         pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(item.row->>'question_text', 'UTF8')), 'hex')
       OR jsonb_typeof(item.row->'source_pages') IS DISTINCT FROM 'array'
       OR item.row->'source_pages' = '[]'::jsonb
       OR item.row->'source_pages'->0 IS DISTINCT FROM item.row->'page_start'
       OR item.row->'source_pages'->(-1) IS DISTINCT FROM item.row->'page_end'
       OR COALESCE(item.row->>'page_start', '') !~ '^[1-9][0-9]{0,5}$'
       OR COALESCE(item.row->>'page_end', '') !~ '^[1-9][0-9]{0,5}$'
       OR COALESCE(item.row->>'paper_page_count', '') !~ '^[1-9][0-9]{0,5}$'
       OR (item.row->>'page_end')::numeric > (item.row->>'paper_page_count')::numeric
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements(item.row->'source_pages') WITH ORDINALITY AS pages(page, position)
         WHERE pages.page::text !~ '^[1-9][0-9]{0,5}$'
           OR (pages.page::text)::numeric < (item.row->>'page_start')::numeric
           OR (pages.page::text)::numeric > (item.row->>'page_end')::numeric
           OR (pages.position > 1 AND (pages.page::text)::numeric <=
               (item.row->'source_pages'->>(pages.position::integer - 2))::numeric)
       )
       OR item.row->>'course' IS DISTINCT FROM 'BSc Life Sciences'
       OR NOT EXISTS (
         SELECT 1 FROM public.papers AS paper
         JOIN (VALUES
           (167, '1', 'Botany', 'DSC'), (172, '1', 'Botany', 'DSC'), (177, '1', 'Botany', 'DSC'),
           (182, '1', 'Chemistry', 'DSC'), (187, '1', 'Chemistry', 'DSC'), (192, '1', 'Chemistry', 'DSC'),
           (197, '1', 'Zoology', 'DSC'), (202, '1', 'Zoology', 'DSC'), (207, '1', 'Zoology', 'DSC'),
           (212, '1', 'Zoology', 'DSC'), (328, '1', 'Zoology', 'DSC'), (261, '3', 'Botany', 'DSC'),
           (265, '3', 'Botany', 'DSC'), (330, '3', 'Botany', 'DSC'), (370, '3', 'Botany', 'DSE'),
           (372, '3', 'Botany', 'DSE'), (269, '3', 'Chemistry', 'DSC'), (273, '3', 'Chemistry', 'DSC'),
           (277, '3', 'Chemistry', 'DSC'), (281, '3', 'Chemistry', 'DSC'), (334, '3', 'Chemistry', 'DSE'),
           (336, '3', 'Chemistry', 'DSE'), (285, '3', 'Zoology', 'DSC'), (288, '3', 'Zoology', 'DSC'),
           (332, '3', 'Zoology', 'DSC'), (253, '3', 'Zoology', 'DSE'), (257, '3', 'Zoology', 'DSE'),
           (291, '3', 'Zoology', 'DSE'), (308, '5', 'Botany', 'DSC'), (350, '5', 'Botany', 'DSC'),
           (352, '5', 'Botany', 'DSC'), (354, '5', 'Botany', 'DSC'), (390, '5', 'Botany', 'DSC'),
           (392, '5', 'Botany', 'DSC'), (316, '5', 'Botany', 'DSE'), (374, '5', 'Botany', 'DSE'),
           (310, '5', 'Chemistry', 'DSC'), (376, '5', 'Chemistry', 'DSC'), (366, '5', 'Chemistry', 'DSE'),
           (368, '5', 'Chemistry', 'DSE'), (312, '5', 'Zoology', 'DSC'), (314, '5', 'Zoology', 'DSC'),
           (394, '5', 'Zoology', 'DSE'), (396, '5', 'Zoology', 'DSE')
         ) AS scope(id, semester, subject, category) ON paper.id = scope.id
         WHERE paper.id::text = item.row->>'paper_id'
           AND scope.semester = item.row->>'semester'
           AND scope.subject = item.row->>'subject'
           AND scope.category = item.row->>'category'
           AND paper.import_key = item.row->>'import_key'
           AND paper.pdf_url = item.row->>'pdf_url'
       )
  ) THEN
    RAISE EXCEPTION 'Topic Search rows must be eligible and match the exact existing exam-season paper source';
  END IF;
  RETURN NEW;
END
$$;

REVOKE ALL ON FUNCTION public.validate_topic_search_snapshot() FROM PUBLIC, anon, authenticated, service_role;
CREATE TRIGGER validate_topic_search_snapshot
  BEFORE INSERT OR UPDATE ON public.topic_search_release_snapshots
  FOR EACH ROW EXECUTE FUNCTION public.validate_topic_search_snapshot();

ALTER TABLE public.topic_search_release_snapshots ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.topic_search_release_snapshots FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT (release_key, payload_text, payload_sha256)
  ON public.topic_search_release_snapshots TO anon, authenticated;
CREATE POLICY topic_search_active_snapshot_read
  ON public.topic_search_release_snapshots FOR SELECT TO anon, authenticated
  USING (is_active);


-- Run only with the explicit owner decision reference and exact approved export digest.
CREATE FUNCTION public.activate_exam_season_topic_search(
  target_key text, expected_sha256 text, decision_ref text, suggestion_ref text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  selected public.topic_search_release_snapshots%ROWTYPE;
BEGIN
  IF decision_ref IS NULL OR pg_catalog.btrim(decision_ref) = '' THEN
    RAISE EXCEPTION 'Explicit owner decision reference required';
  END IF;
  LOCK TABLE public.topic_search_release_snapshots IN SHARE ROW EXCLUSIVE MODE;
  SELECT * INTO selected FROM public.topic_search_release_snapshots WHERE release_key = target_key;
  IF NOT FOUND OR selected.payload_sha256 IS DISTINCT FROM expected_sha256 THEN
    RAISE EXCEPTION 'Release key or approved export digest does not match';
  END IF;
  IF selected.is_active THEN
    IF selected.owner_decision_ref IS DISTINCT FROM decision_ref
       OR selected.suggestion_decision_ref IS DISTINCT FROM suggestion_ref THEN
      RAISE EXCEPTION 'Active snapshot already has a different approval reference';
    END IF;
    RETURN;
  END IF;
  UPDATE public.topic_search_release_snapshots SET is_active = false WHERE is_active;
  UPDATE public.topic_search_release_snapshots
      SET is_active = true, owner_decision_ref = decision_ref, suggestion_decision_ref = suggestion_ref,
          activated_at = statement_timestamp()
      WHERE release_key = target_key;
END
$$;
REVOKE ALL ON FUNCTION public.activate_exam_season_topic_search(text, text, text, text)
  FROM PUBLIC, anon, authenticated, service_role;

COMMIT;
