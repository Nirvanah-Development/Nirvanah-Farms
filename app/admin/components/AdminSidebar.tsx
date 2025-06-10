"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

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

  return (
    <aside className="w-64 bg-[#2c5a3f] text-white h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Nirvanah MS</h1>
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
} 