-- Add full owner-reviewed question coverage to the existing release envelope.
-- Existing approved-only and hybrid releases keep the same validator and activation API.
BEGIN;

CREATE FUNCTION public.validate_exam_season_owner_coverage(body jsonb)
RETURNS void LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  paper jsonb;
  record jsonb;
  topic jsonb;
  mapped jsonb;
  hybrid jsonb := body->'hybrid';
  paper_count integer;
  question_count integer;
  scope CONSTANT jsonb := '{"167":["BSc Life Sciences",1,"Botany","DSC"],"172":["BSc Life Sciences",1,"Botany","DSC"],"177":["BSc Life Sciences",1,"Botany","DSC"],"182":["BSc Life Sciences",1,"Chemistry","DSC"],"187":["BSc Life Sciences",1,"Chemistry","DSC"],"192":["BSc Life Sciences",1,"Chemistry","DSC"],"197":["BSc Life Sciences",1,"Zoology","DSC"],"202":["BSc Life Sciences",1,"Zoology","DSC"],"207":["BSc Life Sciences",1,"Zoology","DSC"],"212":["BSc Life Sciences",1,"Zoology","DSC"],"253":["BSc Life Sciences",3,"Zoology","DSE"],"257":["BSc Life Sciences",3,"Zoology","DSE"],"261":["BSc Life Sciences",3,"Botany","DSC"],"265":["BSc Life Sciences",3,"Botany","DSC"],"269":["BSc Life Sciences",3,"Chemistry","DSC"],"273":["BSc Life Sciences",3,"Chemistry","DSC"],"277":["BSc Life Sciences",3,"Chemistry","DSC"],"281":["BSc Life Sciences",3,"Chemistry","DSC"],"285":["BSc Life Sciences",3,"Zoology","DSC"],"288":["BSc Life Sciences",3,"Zoology","DSC"],"291":["BSc Life Sciences",3,"Zoology","DSE"],"308":["BSc Life Sciences",5,"Botany","DSC"],"310":["BSc Life Sciences",5,"Chemistry","DSC"],"312":["BSc Life Sciences",5,"Zoology","DSC"],"314":["BSc Life Sciences",5,"Zoology","DSC"],"316":["BSc Life Sciences",5,"Botany","DSE"],"328":["BSc Life Sciences",1,"Zoology","DSC"],"330":["BSc Life Sciences",3,"Botany","DSC"],"332":["BSc Life Sciences",3,"Zoology","DSC"],"334":["BSc Life Sciences",3,"Chemistry","DSE"],"336":["BSc Life Sciences",3,"Chemistry","DSE"],"350":["BSc Life Sciences",5,"Botany","DSC"],"352":["BSc Life Sciences",5,"Botany","DSC"],"354":["BSc Life Sciences",5,"Botany","DSC"],"366":["BSc Life Sciences",5,"Chemistry","DSE"],"368":["BSc Life Sciences",5,"Chemistry","DSE"],"370":["BSc Life Sciences",3,"Botany","DSE"],"372":["BSc Life Sciences",3,"Botany","DSE"],"374":["BSc Life Sciences",5,"Botany","DSE"],"376":["BSc Life Sciences",5,"Chemistry","DSC"],"390":["BSc Life Sciences",5,"Botany","DSC"],"392":["BSc Life Sciences",5,"Botany","DSC"],"394":["BSc Life Sciences",5,"Zoology","DSE"],"396":["BSc Life Sciences",5,"Zoology","DSE"]}'::jsonb;
  keys CONSTANT text[] := ARRAY['paper_id','title','import_key','year','pdf_url','scope','paper_page_count',
    'syllabus_version_id','pages','review_pages','records'];
  uuid_pattern CONSTANT text := '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$';
BEGIN
  IF body - ARRAY['format_version','source','storage_host','boundary_review','hybrid','papers','topic_catalog',
                  'question_count'] <> '{}'::jsonb
     OR body->>'source' IS DISTINCT FROM 'dupyq-exam-season-owner-coverage'
     OR body->>'boundary_review' IS DISTINCT FROM 'owner-confirmed-only'
     OR coalesce(body->>'storage_host','') !~ '^[a-z0-9]+[.]supabase[.]co$'
     OR hybrid->>'storage_host' IS DISTINCT FROM body->>'storage_host'
     OR hybrid->'format_version' IS DISTINCT FROM '3'::jsonb
     OR jsonb_typeof(body->'papers') IS DISTINCT FROM 'array'
     OR jsonb_array_length(body->'papers') <> 44
     OR jsonb_typeof(body->'topic_catalog') IS DISTINCT FROM 'array'
     OR jsonb_array_length(body->'topic_catalog') = 0
     OR jsonb_typeof(body->'question_count') IS DISTINCT FROM 'number'
     OR coalesce(body->>'question_count','') !~ '^[1-9][0-9]{0,5}$' THEN
    RAISE EXCEPTION 'Invalid owner-reviewed coverage envelope';
  END IF;

  FOR paper IN SELECT value FROM jsonb_array_elements(body->'papers') LOOP
    IF NOT (paper ?& keys) OR paper - keys <> '{}'::jsonb
       OR jsonb_typeof(paper->'paper_id') IS DISTINCT FROM 'number'
       OR scope->(paper->>'paper_id') IS DISTINCT FROM paper->'scope'
       OR coalesce(paper->>'syllabus_version_id','') !~ uuid_pattern
       OR nullif(btrim(paper->>'title'),'') IS NULL
       OR coalesce(paper->>'import_key','') !~ '^dupyq-file-[a-f0-9]{16}$'
       OR coalesce(paper->>'paper_page_count','') !~ '^[1-9][0-9]{0,2}$'
       OR paper->'review_pages' IS DISTINCT FROM '[]'::jsonb
       OR jsonb_typeof(paper->'records') IS DISTINCT FROM 'array'
       OR NOT EXISTS (SELECT 1 FROM public.papers p
         WHERE p.id::text = paper->>'paper_id' AND p.import_key = paper->>'import_key'
         AND p.pdf_url = paper->>'pdf_url') THEN
      RAISE EXCEPTION 'Coverage paper does not match the exam-season catalogue or completed review';
    END IF;
    IF paper->'pages' IS DISTINCT FROM (
       SELECT jsonb_agg(n ORDER BY n) FROM generate_series(1,(paper->>'paper_page_count')::integer) n
    ) OR paper->>'pdf_url' NOT LIKE 'https://' || (body->>'storage_host') || '/storage/v1/object/public/PYQ/bulk-import/'
                            || (paper->>'import_key') || '/%.pdf'
       OR paper->>'pdf_url' ~ '[[:space:]?#]' THEN
      RAISE EXCEPTION 'Invalid original paper URL or coverage pages';
    END IF;
    FOR record IN SELECT value FROM jsonb_array_elements(paper->'records') LOOP
      IF NOT (record ?& ARRAY['id','ref','pages','status','text'])
         OR record - ARRAY['id','ref','pages','status','text','partial_text'] <> '{}'::jsonb
         OR coalesce(record->>'id','') !~ uuid_pattern
         OR nullif(btrim(record->>'ref'),'') IS NULL OR char_length(record->>'ref')>100
         OR jsonb_typeof(record->'pages') IS DISTINCT FROM 'array'
         OR jsonb_array_length(record->'pages')=0
         OR NOT ((paper->'pages') @> (record->'pages'))
         OR NOT coalesce((record->>'status'='unclassified' AND jsonb_typeof(record->'text')='string'
                 AND btrim(record->>'text')<>'' AND NOT (record ? 'partial_text')) OR
                (record->>'status'='original_region' AND record->'text'='null'::jsonb AND
                  (NOT (record ? 'partial_text') OR
                    (jsonb_typeof(record->'partial_text')='string' AND char_length(record->>'partial_text') BETWEEN 1 AND 8000
                     AND btrim(record->>'partial_text')<>''))),false)
         OR EXISTS (
              SELECT 1 FROM jsonb_array_elements(record->'pages') WITH ORDINALITY AS r(page,n)
              WHERE r.n>1 AND r.page::text::integer <= (record->'pages'->>(r.n::integer-2))::integer
         ) THEN
        RAISE EXCEPTION 'Invalid source-backed coverage question';
      END IF;
    END LOOP;
  END LOOP;

  SELECT count(DISTINCT value->>'paper_id') INTO paper_count FROM jsonb_array_elements(body->'papers');
  IF paper_count <> 44 THEN RAISE EXCEPTION 'Duplicate or missing coverage paper'; END IF;

  FOR topic IN SELECT value FROM jsonb_array_elements(body->'topic_catalog') LOOP
    IF NOT (topic ?& ARRAY['id','label','unit','syllabus_version_id'])
       OR topic - ARRAY['id','label','unit','syllabus_version_id'] <> '{}'::jsonb
       OR coalesce(topic->>'id','') !~ uuid_pattern
       OR nullif(btrim(topic->>'label'),'') IS NULL OR nullif(btrim(topic->>'unit'),'') IS NULL
       OR NOT EXISTS (
         SELECT 1 FROM jsonb_array_elements(body->'papers') AS p
         WHERE p->>'syllabus_version_id'=topic->>'syllabus_version_id'
       ) THEN RAISE EXCEPTION 'Topic falls outside the coverage syllabus catalogue'; END IF;
  END LOOP;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(body->'topic_catalog') AS t GROUP BY t->>'id' HAVING count(*)>1)
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(body->'papers') AS p WHERE NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(body->'topic_catalog') AS t
        WHERE t->>'syllabus_version_id'=p->>'syllabus_version_id'
      )) THEN
    RAISE EXCEPTION 'Duplicate topic or missing syllabus catalogue';
  END IF;

  FOR mapped IN SELECT value FROM jsonb_array_elements((hybrid->'results') || (hybrid->'suggestions')) LOOP
    IF NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(body->'papers') AS p
      WHERE p->'paper_id'=mapped->'paper_id' AND p->>'title'=mapped->>'paper_title'
       AND p->>'import_key'=mapped->>'import_key' AND p->>'pdf_url'=mapped->>'pdf_url'
       AND p->'year'=mapped->'year' AND p->'paper_page_count'=mapped->'paper_page_count'
       AND p->>'syllabus_version_id'=mapped->>'syllabus_version_id'
    ) OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(body->'topic_catalog') AS t
      WHERE t->>'id'=mapped->>'topic_id' AND t->>'syllabus_version_id'=mapped->>'syllabus_version_id'
        AND t->>'label'=mapped->>'topic_label' AND t->>'unit'=mapped->>'unit_label'
    ) THEN RAISE EXCEPTION 'Mapped question conflicts with paper or syllabus coverage'; END IF;
  END LOOP;

  IF EXISTS (
    WITH mapped AS (SELECT value FROM jsonb_array_elements((hybrid->'results') || (hybrid->'suggestions'))),
    outside AS (SELECT item.value AS entry FROM jsonb_array_elements(body->'papers') p
                CROSS JOIN LATERAL jsonb_array_elements(p->'records') item)
    SELECT 1 FROM outside GROUP BY entry->>'id' HAVING count(*)>1
    UNION ALL
    SELECT 1 FROM outside WHERE EXISTS (SELECT 1 FROM mapped WHERE value->>'question_id'=entry->>'id')
    UNION ALL
    SELECT 1 FROM jsonb_array_elements(hybrid->'results') a
    JOIN jsonb_array_elements(hybrid->'suggestions') b ON a->>'question_id'=b->>'question_id'
  ) THEN RAISE EXCEPTION 'Question appears more than once across coverage tiers'; END IF;

  SELECT count(DISTINCT id) INTO question_count FROM (
    SELECT value->>'question_id' AS id FROM jsonb_array_elements((hybrid->'results') || (hybrid->'suggestions'))
    UNION ALL
    SELECT item.value->>'id' FROM jsonb_array_elements(body->'papers') p
      CROSS JOIN LATERAL jsonb_array_elements(p->'records') item
  ) AS identities;
  IF question_count <> (body->>'question_count')::integer THEN RAISE EXCEPTION 'Coverage count mismatch'; END IF;
END
$$;

REVOKE ALL ON FUNCTION public.validate_exam_season_owner_coverage(jsonb)
  FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.validate_topic_search_snapshot()
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
  IF body->'format_version' = '4'::jsonb THEN
    PERFORM public.validate_exam_season_owner_coverage(body);
    body := body->'hybrid';
  END IF;
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

COMMIT;
