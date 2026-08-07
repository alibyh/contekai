"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CircularMenuConfig {
  items: Array<{
    id: string;
    label: string;
    onClick?: () => void;
  }>;
  bubbleGradient?: string;
  accentColor?: string;
  onMenuOpenChange?: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

/**
 * Reusable circular-reveal mobile menu with cascading animations.
 * Customize colors via bubbleGradient and accentColor props.
 *
 * Usage:
 * <CircularMenu
 *   items={[
 *     { id: "home", label: "Home", onClick: () => router.push("/") },
 *     { id: "about", label: "About" },
 *   ]}
 *   bubbleGradient="radial-gradient(circle at 70% 30%, #ff6b9d 0%, #c44569 45%, #1a1a2e 100%)"
 *   accentColor="#ff6b9d"
 * />
 */
export function CircularMenu({
  items,
  bubbleGradient = "radial-gradient(circle at 70% 30%, #ce4c82 0%, #8c2a4d 45%, #2b2230 100%)",
  accentColor = "#ce4c82",
  onMenuOpenChange,
  children,
}: CircularMenuConfig) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoKey, setLogoKey] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setLogoKey((k) => k + 1);
      onMenuOpenChange?.(true);
    } else {
      onMenuOpenChange?.(false);
    }
  }, [open, onMenuOpenChange]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  const toggle = (
    <button
      type="button"
      aria-label="Menu"
      aria-expanded={open}
      aria-controls="circular-menu"
      onClick={() => setOpen((v) => !v)}
      className={`circular-menu-burger flex h-10 w-10 flex-col items-center justify-center gap-[6px]${open ? " is-open" : ""}`}
      style={{
        "--accent-color": accentColor,
      } as React.CSSProperties}
    >
      <span className="burger-line burger-line-1 block h-[2px] w-6 rounded-full" style={{ backgroundColor: accentColor }} />
      <span className="burger-line burger-line-2 block h-[2px] w-6 rounded-full" style={{ backgroundColor: accentColor }} />
      <span className="burger-line burger-line-3 block h-[2px] w-6 rounded-full" style={{ backgroundColor: accentColor }} />
    </button>
  );

  const overlay = (
    <div
      id="circular-menu"
      className={`circular-menu-root fixed inset-0 z-[45] overflow-hidden${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      {/* Circular bubble that scales from button corner */}
      <div
        className="circular-menu-bubble absolute top-[calc(2rem-150vmax)] end-[calc(2.25rem-150vmax)] h-[300vmax] w-[300vmax] rounded-full"
        style={{ backgroundImage: bubbleGradient }}
      />

      {/* Menu content */}
      <div className="circular-menu-content absolute inset-0 flex flex-col overflow-y-auto px-8 pb-12 pt-24">
        {/* Custom children (e.g., logo) — can be remounted via key */}
        {children && (
          <div
            className="circular-menu-item flex justify-center pb-0"
            style={{ transitionDelay: open ? "180ms" : "0ms" }}
            key={logoKey}
          >
            {children}
          </div>
        )}

        {/* Nav items */}
        <nav className="flex flex-1 flex-col justify-center gap-0">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick?.();
                close();
              }}
              style={{
                transitionDelay: open ? `${260 + i * 75}ms` : `${i * 20}ms`,
              }}
              className="circular-menu-item group flex items-center justify-between border-b border-white/15 px-0 py-4 text-left"
            >
              <span className="text-2xl font-semibold text-white transition-[padding] duration-300 group-hover:ps-2">
                {item.label}
              </span>
              <span className="text-sm opacity-50 text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {toggle}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
