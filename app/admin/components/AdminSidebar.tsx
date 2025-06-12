"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-sidebar') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobileMenuOpen]);

  const menuItems = [
    {
      title: "Inventory",
      items: [
        {
          name: "Offices",
          href: "/admin/offices",
          icon: Building2,
        },
      ],
    },
  ];

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside className={`bg-[#2c5a3f] text-white h-full flex flex-col ${isMobile ? 'w-80' : 'w-64'}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-[#1e3f2a]">
          <h1 className="text-xl font-bold">Nirvanah MS</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 hover:bg-[#1e3f2a] rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
      
      <div className={`p-6 ${isMobile ? 'pt-4' : ''}`}>
        {!isMobile && <h1 className="text-2xl font-bold">Nirvanah MS</h1>}
        {user && (
          <p className="text-sm text-gray-300 mt-2">
            Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
          </p>
        )}
      </div>
      
      <nav className="mt-8 flex-1">
        {menuItems.map((section) => (
          <div key={section.title}>
            <h2 className="px-6 py-2 text-sm font-semibold text-gray-300">
              {section.title}
            </h2>
            <ul>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-6 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-[#1e3f2a] border-l-4 border-white"
                          : "hover:bg-[#1e3f2a]"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sign Out Section */}
      <div className="p-6 border-t border-[#1e3f2a]">
        <SignOutButton>
          <button className="flex items-center w-full px-0 py-2 text-sm text-gray-300 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="mobile-menu-button fixed top-4 left-4 z-50 p-2 bg-[#2c5a3f] text-white rounded-md shadow-lg md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`mobile-sidebar fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent isMobile />
      </div>
    </>
  );
} 