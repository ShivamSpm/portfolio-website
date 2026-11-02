"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { contact } from "@/content/home";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the mailto link still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="label-mono inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-muted transition-colors hover:border-ink hover:text-ink"
    >
      {copied ? (
        <Check aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
      ) : (
        <Copy aria-hidden className="size-4" strokeWidth={1.75} />
      )}
      <span aria-live="polite">{copied ? contact.copiedLabel : contact.copyEmailLabel}</span>
    </button>
  );
}
