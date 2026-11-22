"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { GoogleAnalytics, sendGAEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

type WebVitalsMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

function reportWebVitalsToGA(metric: WebVitalsMetric) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/wm-gen")) return;

  // CLS is unitless; multiply by 1000 so integer GA4 event values keep precision.
  const value = Math.round(
    metric.name === "CLS" ? metric.value * 1000 : metric.value
  );

  sendGAEvent("event", metric.name, {
    value,
    metric_id: metric.id,
    non_interaction: true,
  });
}

function filterInternalAnalytics(event: BeforeSendEvent): BeforeSendEvent | null {
  if (event.url.includes("/wm-gen")) {
    return null;
  }
  return event;
}

export function AnalyticsProviders() {
  const pathname = usePathname();
  const isInternalRoute = pathname?.startsWith("/wm-gen") ?? false;

  useReportWebVitals(reportWebVitalsToGA);

  return (
    <>
      <Analytics beforeSend={filterInternalAnalytics} />
      {GA_MEASUREMENT_ID && !isInternalRoute ? (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      ) : null}
    </>
  );
}
