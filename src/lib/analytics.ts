"use client";

import { track } from "@vercel/analytics";
import { sendGAEvent } from "@next/third-parties/google";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

export type AnalyticsEventName =
  | "view_menu_detail"
  | "select_menu_category"
  | "add_to_order"
  | "apply_event_package"
  | "submit_whatsapp_order"
  | "copy_whatsapp_format"
  | "click_whatsapp"
  | "click_maps"
  | "click_instagram";

type AnalyticsParamValue = string | number | boolean;

export function trackEvent(
  eventName: AnalyticsEventName,
  params?: Record<string, AnalyticsParamValue | undefined>
) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/wm-gen")) return;

  const cleanParams: Record<string, AnalyticsParamValue> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        cleanParams[key] = value;
      }
    }
  }

  const hasParams = Object.keys(cleanParams).length > 0;

  try {
    // Only dispatch to GA4 when GoogleAnalytics is initialized to avoid console warnings.
    if (GA_MEASUREMENT_ID) {
      if (hasParams) {
        sendGAEvent("event", eventName, cleanParams);
      } else {
        sendGAEvent("event", eventName);
      }
    }
    track(eventName, hasParams ? cleanParams : undefined);
  } catch {
    // Tracking blockers or script failures must never disrupt ordering actions.
  }
}
