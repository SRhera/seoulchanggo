"use client";

import { LogIn, LogOut, User, X } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { categories } from "@/data/categories";
import { useAuth } from "@/contexts/AuthContext";
import { useMarket } from "@/contexts/MarketContext";
import { getLocalizedCategoryLabel } from "@/lib/productLocalization";
import { getMessages } from "@/messages";

type NavDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { market } = useMarket();
  const messages = getMessages(market.locale);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" role="presentation" onClick={onClose} />
      <div className="relative flex h-full w-72 flex-col overflow-y-auto bg-background">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <User size={20} className="text-text-main" />
              <span className="text-sm font-bold text-text-main">{currentUser.displayName}</span>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-bold text-text-main"
            >
              <LogIn size={20} />
              {messages.auth.signIn}
            </Link>
          )}
          <button type="button" aria-label={messages.a11y.closeMenu} onClick={onClose} className="text-text-main">
            <X size={20} />
          </button>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-2 border-b border-border px-4 py-3 text-left text-sm text-text-secondary"
          >
            <LogOut size={16} />
            {messages.auth.signOut}
          </button>
        )}

        <div className="border-b border-border px-4 py-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
            {messages.nav.allCategories}
          </p>
          <div className="flex flex-col">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 py-2 text-sm text-text-main"
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {getLocalizedCategoryLabel(category, market.locale)}
                </Link>
              );
            })}
          </div>
        </div>

        <nav className="flex flex-col px-4 py-3">
          <Link
            href={isAuthenticated ? "/mypage" : "/auth?returnTo=/mypage"}
            onClick={onClose}
            className="py-2.5 text-sm font-medium text-text-main"
          >
            {messages.nav.myPage}
          </Link>
          <Link href="/cart" onClick={onClose} className="py-2.5 text-sm font-medium text-text-main">
            {messages.nav.cart}
          </Link>
          <Link href="/notices" onClick={onClose} className="py-2.5 text-sm font-medium text-text-main">
            {messages.notice.title}
          </Link>
          <Link href="/faq" onClick={onClose} className="py-2.5 text-sm font-medium text-text-main">
            {messages.faq.title}
          </Link>
        </nav>
      </div>
    </div>,
    document.body
  );
}
