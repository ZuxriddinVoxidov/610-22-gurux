"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Image as ImageIcon, LogOut, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname?.startsWith(path);
  };

  const navLinks = [
    { href: "/admin", label: "Boshqaruv", icon: LayoutDashboard },
    { href: "/admin/students", label: "Talabalar", icon: Users },
    { href: "/admin/gallery", label: "Galereya", icon: ImageIcon },
    { href: "/admin/settings", label: "Sozlamalar", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-blue-400">Admin Panel</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">610-22 Yearbook</p>
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1.5">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/35'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-850 hover:text-white rounded-xl text-sm font-bold text-slate-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" /> Saytga qaytish
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 dark:bg-slate-950 transition-colors">
      {/* Mobile Top Bar */}
      <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-45 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-black text-blue-400 leading-tight">Admin Panel</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">610-22</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-slate-800 text-slate-350 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200 dark:border-slate-850">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-50"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-64 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
