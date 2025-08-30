'use client';
import { AdminSidebar } from './AdminSidebar';
import { Navigation } from '@/components/Navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-950 flex pt-14">
        <AdminSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}