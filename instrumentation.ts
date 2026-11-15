import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

// This provider is intentionally separate from the global provider so only the
// purpose-written logs below are exported to PostHog.
export const posthogLogProvider = projectToken && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({ "service.name": "du-pyq-hub" }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host.replace(/\/$/, "")}/i/v1/logs`,
            timeoutMillis: 2000,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              "Content-Type": "application/json",
            },
          }),
        }),
      ],
    })
  : null;

export const posthogAppLogger = posthogLogProvider?.getLogger("du-pyq-hub.posthog");

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  if (posthogLogProvider) {
    process.once("beforeExit", () => {
      void posthogLogProvider.shutdown().catch(() => {});
    });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    if (!projectToken) {
      console.warn(
        "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      );
    }

    if (!host) {
      console.warn(
        "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured",
      );
    }
  }
}
