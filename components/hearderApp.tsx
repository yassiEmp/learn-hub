"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Menu, X, LogOut } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

const navbarVariants = cva(
  "bg-background/20 border px-6 max-w-4xl w-full py-3 border-foreground/10 backdrop-blur-md mx-auto transition-[border-radius] duration-200",
  {
    variants: { isMenuOpen: { true: "rounded-xl", false: "rounded-full" } },
    defaultVariants: { isMenuOpen: false },
  }
);

const navItemVariants = cva(
  "px-4 py-2 rounded-full text-xs font-geist-mono transition-all duration-300",
  {
    variants: {
      active: {
        true: "text-foreground bg-muted/30 border border-foreground/10",
        false: "text-muted-foreground hover:text-foreground hover:bg-muted/30",
      },
    },
    defaultVariants: { active: false },
  }
);

const mobileMenuItemVariants = cva(
  "block w-full text-left px-3 py-2 rounded-lg text-xs font-geist-mono transition-all duration-200",
  {
    variants: {
      active: {
        true: "text-foreground bg-muted/60",
        false: "text-muted-foreground hover:text-foreground hover:bg-muted/30",
      },
    },
    defaultVariants: { active: false },
  }
);

const NAV_ITEMS = [
  { id: 'create', label: 'Create', path: '/create', match: ['/create'] },
  { id: 'courses', label: 'My courses', path: '/courses', match: ['/courses', '/course/', '/dashboard'] },
  { id: 'exams', label: 'Exams', path: '/exams', match: ['/exams', '/exam/'] },
  { id: 'account', label: 'Account', path: '/account', match: ['/account'] },
];

function isActive(pathname: string, match: string[]) {
  return match.some((m) => (m.endsWith('/') ? pathname.startsWith(m) : pathname === m));
}

/** App navigation for signed-in pages. `currentPath` is optional; the URL is used by default. */
export default function Nav({ currentPath }: { currentPath?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || currentPath || '';
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    router.push('/');
    await signOut();
  };

  return (
    <nav className="fixed top-6 transform z-50 w-full px-4 animate-slide-down">
      <div className={navbarVariants({ isMenuOpen })}>
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-sm font-syne font-medium text-foreground">flashmind</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={navItemVariants({ active: isActive(pathname, item.match) })}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <span className="text-foreground/80 font-geist-mono text-xs max-w-[140px] truncate">
                {user.name || user.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 pb-2 space-y-2 border-t border-border/20 mt-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={mobileMenuItemVariants({ active: isActive(pathname, item.match) })}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/20 mt-2 space-y-2">
              {user && (
                <div className="px-3 py-2 text-foreground/80 font-geist-mono text-xs truncate">
                  {user.name || user.email}
                </div>
              )}
              <button
                onClick={handleSignOut}
                className={mobileMenuItemVariants({ active: false })}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
