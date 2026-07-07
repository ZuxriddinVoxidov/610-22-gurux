"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { GraduationCap, Users, Image as ImageIcon, Timer, LogOut, Home, Menu, X, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email === 'admin@61022.uz') {
        setIsAdmin(true);
      }
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Bosh sahifa', icon: Home },
    { href: '/students', label: 'Talabalar', icon: Users },
    { href: '/gallery', label: 'Galereya', icon: ImageIcon },
    { href: '/time-capsule', label: 'Vaqtimiz', icon: Timer },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/20 dark:border-slate-800/40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight">
              610-22 Yearbook
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-1 lg:gap-3 items-center">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                    active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`} />
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                title="Admin Sozlamalari"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-hidden shadow-lg"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      active
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Tizimdan chiqish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
