"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import { getWhatsAppGeneralLink } from "@/data/menu";

interface FloatingOrderBarProps {
  selectedCount: number;
  hidden?: boolean;
}

export function FloatingOrderBar({
  selectedCount,
  hidden = false,
}: FloatingOrderBarProps) {
  if (hidden) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6">
      {selectedCount > 0 ? (
        <>
          <a
            href={getWhatsAppGeneralLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat WhatsApp Dapoer Bulek"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-charcoal-border bg-charcoal text-cream transition-colors hover:border-golden hover:text-golden"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="#pesan"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-charcoal bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Format Pesanan ({selectedCount})</span>
          </a>
        </>
      ) : (
        <a
          href={getWhatsAppGeneralLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-charcoal bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span>Chat WhatsApp</span>
        </a>
      )}
    </div>
  );
}
