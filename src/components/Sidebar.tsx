import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Users,
  Lock,
  GraduationCap,
  ClipboardCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School,
  Image,
  X,
} from 'lucide-react';

export type TeacherTab =
  | 'analytics'
  | 'students'
  | 'classrooms'
  | 'materials'
  | 'modules'
  | 'grading'
  | 'gallery_moderation';

interface SidebarProps {
  activeTab: TeacherTab;
  onTabChange: (tab: TeacherTab) => void;
  onLogout: () => void;
  teacherName?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const tabs: { id: TeacherTab; label: string; icon: React.ReactNode }[] = [
  { id: 'analytics', label: 'Dashboard', icon: <BarChart3 size={20} /> },
  { id: 'students', label: 'Kelola Murid', icon: <Users size={20} /> },
  { id: 'classrooms', label: 'Manajemen Kelas', icon: <School size={20} /> },
  { id: 'materials', label: 'Kelola Materi', icon: <GraduationCap size={20} /> },
  { id: 'modules', label: 'Kontrol Modul', icon: <Lock size={20} /> },
  { id: 'grading', label: 'Penilaian', icon: <ClipboardCheck size={20} /> },
  { id: 'gallery_moderation', label: 'Persetujuan Karya', icon: <Image size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  teacherName,
  isMobile = false,
  onClose,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const isSidebarCollapsed = isMobile ? false : collapsed;

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex h-screen flex-col border-r border-surface-200 bg-white text-surface-800 shadow-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-200 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-white">
            <img src="/logo.png" alt="Logo SiberCerdas" className="h-8 w-8 object-contain" />
          </div>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-display text-lg font-bold text-surface-900 whitespace-nowrap">
                SiberCerdas
              </h1>
              {teacherName && (
                <p className="max-w-[160px] truncate text-xs text-surface-500">{teacherName}</p>
              )}
            </motion.div>
          )}
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-surface-500 hover:text-surface-700 bg-surface-50 border border-surface-200 shadow-2xs hover:bg-surface-100 active:scale-95 transition-all flex items-center justify-center"
            title="Tutup Menu"
            aria-label="Tutup Menu Navigasi"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? 'border-primary-100 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-transparent text-surface-500 hover:border-surface-200 hover:bg-surface-50 hover:text-surface-800'
                }
              `}
            >
              <span className={isActive ? 'text-primary-600' : 'text-surface-400'}>{tab.icon}</span>
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {tab.label}
                </motion.span>
              )}
              {isActive && !isSidebarCollapsed && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-surface-200 px-3 py-4">
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-500"
        >
          <LogOut size={20} />
          {!isSidebarCollapsed && <span>Keluar</span>}
        </motion.button>
      </div>

      {/* Collapse toggle */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-0 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 shadow-card transition-colors hover:bg-primary-50"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}
    </motion.aside>
  );
};

export default Sidebar;
