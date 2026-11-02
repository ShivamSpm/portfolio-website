"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { nav, ui } from "@/content/home";
import { site } from "@/content/site";

// Phone-only menu sheet. Radix handles the focus trap, Esc and scroll lock.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={nav.menuLabel}
        className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink md:hidden"
      >
        <Menu aria-hidden className="size-5" strokeWidth={1.75} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/80 md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          // Don't jump focus back to the trigger: the link the visitor chose should win.
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface px-5 pt-3 pb-8 md:hidden"
        >
          <div className="flex h-10 items-center justify-between">
            <Dialog.Title className="label-mono text-muted">{nav.menuLabel}</Dialog.Title>
            <Dialog.Close
              aria-label={nav.closeMenuLabel}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
            >
              <X aria-hidden className="size-5" strokeWidth={1.75} />
            </Dialog.Close>
          </div>
          <ul className="mt-4">
            {nav.links.map((link) => (
              <li key={link.href} className="border-b border-line last:border-b-0">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center font-display text-[28px] text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {site.resumeUrl && (
              <li>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-14 items-center font-display text-[28px] text-ink"
                >
                  {nav.resumeLabel}
                  <span className="sr-only"> {ui.newTab}</span>
                </a>
              </li>
            )}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
