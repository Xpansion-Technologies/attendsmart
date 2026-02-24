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
  User,
  Route,
  LogOut
} from 'lucide-react';
import BrandingImg from '../../assets/Branding.png';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userProfile?: any;
  onLogout?: () => void;
}

const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  userProfile, 
  onLogout 
}: { 
  activeTab: string, 
  onTabChange: (tab: string) => void,
  userProfile?: any,
  onLogout?: () => void
}) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Students', icon: Users },
    { name: 'Buses', icon: Bus },
    { name: 'Trip Setup', icon: Route },
    { name: 'Attendance', icon: CalendarCheck },
    { name: 'Drivers', icon: UserSquare2 },
    { name: 'Parents', icon: ShieldCheck },
  ];

  return (
    <div className="w-64 bg-dps-teal text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <img src={BrandingImg} alt="DPS Greater Noida Logo" className="w-full h-auto" />
      </div>
      
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
            <User size={24} />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold truncate">{userProfile?.full_name || 'Administrator'}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">{userProfile?.role || 'Staff'}</div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
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

const Topbar = ({ activeTab, userProfile }: { activeTab: string, userProfile?: any }) => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span className="hover:text-dps-teal cursor-pointer transition-colors">Home</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-bold">{activeTab}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex relative group">
          <input 
            type="text" 
            placeholder="Quick Search..." 
            className="bg-gray-100 border-none rounded-full py-1.5 px-4 text-xs w-48 focus:ring-2 focus:ring-dps-teal/20 focus:bg-white transition-all"
          />
          <Search size={14} className="absolute right-3 top-2 text-gray-400" />
        </div>

        <div className="flex items-center space-x-4 border-l pl-4 border-gray-100">
          <div className="relative cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
            <MessageSquare size={20} className="text-gray-400" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
          </div>
          <div className="relative cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-1 right-1 bg-dps-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">5</span>
          </div>
          
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors ml-2">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-bold text-gray-900 leading-none">{userProfile?.full_name || 'Admin'}</span>
              <span className="text-[10px] text-gray-500 font-medium capitalize">{userProfile?.role || 'staff'}</span>
            </div>
            <div className="w-8 h-8 bg-dps-teal/10 rounded-full flex items-center justify-center text-dps-teal font-bold text-xs border border-dps-teal/20">
              {userProfile?.full_name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Layout = ({ children, activeTab, onTabChange, userProfile, onLogout }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        userProfile={userProfile}
        onLogout={onLogout}
      />
      <div className="ml-64 pt-14">
        <Topbar activeTab={activeTab} userProfile={userProfile} />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
