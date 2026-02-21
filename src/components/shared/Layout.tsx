import { type ReactNode } from 'react';
import { 
  Users, 
  Bus, 
  CalendarCheck, 
  UserSquare2, 
  ShieldCheck, 
  LayoutDashboard,
  Search,
  Bell,
  MessageSquare,
  User
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Students', icon: Users },
    { name: 'Buses', icon: Bus },
    { name: 'Attendance', icon: CalendarCheck },
    { name: 'Drivers', icon: UserSquare2 },
    { name: 'Parents', icon: ShieldCheck },
  ];

  return (
    <div className="w-64 bg-dps-teal text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-white/10">
        SchAttendance
      </div>
      
      <div className="p-4 flex items-center space-x-3 border-b border-white/10">
        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
          <User size={24} />
        </div>
        <div>
          <div className="text-sm font-medium">Administrator</div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-white/10 text-sm rounded py-2 px-3 pr-8 focus:outline-none placeholder:text-white/50"
          />
          <Search className="absolute right-2 top-2.5 text-white/50" size={16} />
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onTabChange(item.name)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded transition-colors ${
              activeTab === item.name ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const Topbar = ({ activeTab }: { activeTab: string }) => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span>Home</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{activeTab}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Search size={20} className="text-gray-400 cursor-pointer" />
        <div className="relative cursor-pointer">
          <MessageSquare size={20} className="text-gray-400" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </div>
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-400" />
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">5</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer border-l pl-4 ml-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-green-600">Active</span>
          <span className="text-xs text-gray-500">Administrator</span>
        </div>
      </div>
    </div>
  );
};

export const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="ml-64 pt-14">
        <Topbar activeTab={activeTab} />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
