import { useState, useEffect } from 'react';
import { 
  Users, 
  Bus, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { SupabaseTest } from '../../components/shared/SupabaseTest';
import { isSupabaseConfigured, supabase } from '../../services/supabaseClient';
import { db } from '../../services/db';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const STATS = [
  { label: 'Total Students', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Buses', value: '42', icon: Bus, color: 'text-dps-teal', bg: 'bg-dps-teal/10' },
  { label: 'Buses Running', value: '38', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Drivers on Duty', value: '40', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const BUS_ATTENDANCE_DATA = [
  { name: 'BUS-101', present: 45, total: 50 },
  { name: 'BUS-102', present: 38, total: 45 },
  { name: 'BUS-103', present: 42, total: 48 },
  { name: 'BUS-104', present: 30, total: 35 },
  { name: 'BUS-105', present: 48, total: 50 },
  { name: 'BUS-106', present: 35, total: 40 },
];

const TRIP_DATA = [
  { name: 'Morning Trip', value: 38, color: '#004b61' },
  { name: 'Afternoon Trip', value: 35, color: '#d4af37' },
  { name: 'Evening Trip', value: 25, color: '#006400' },
];

const BUS_LOCATIONS = [
  { id: 1, bus: 'BUS-101', lat: 20, lng: 30, status: 'Moving' },
  { id: 2, bus: 'BUS-102', lat: 45, lng: 60, status: 'Stopped' },
  { id: 3, bus: 'BUS-103', lat: 70, lng: 25, status: 'Moving' },
  { id: 4, bus: 'BUS-104', lat: 35, lng: 80, status: 'Moving' },
  { id: 5, bus: 'BUS-105', lat: 80, lng: 75, status: 'Delayed' },
];

export const Dashboard = () => {
  const [stats, setStats] = useState(STATS);
  const [busAttendance, setBusAttendance] = useState(BUS_ATTENDANCE_DATA);
  const [tripData] = useState(TRIP_DATA);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        return;
      }

      try {
        // 1. Fetch Stats
        const [
          { count: studentsCount },
          { count: busesCount },
          { count: driversCount }
        ] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('buses').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'driver')
        ]);

        setStats([
          { label: 'Total Students', value: (studentsCount || 1284).toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Buses', value: (busesCount || 42).toString(), icon: Bus, color: 'text-dps-teal', bg: 'bg-dps-teal/10' },
          { label: 'Buses Running', value: Math.floor((busesCount || 42) * 0.9).toString(), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Drivers on Duty', value: (driversCount || 40).toString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        ]);

        // 2. Fetch Chart Data (Simplified for PoC)
        const students = await db.students.getAll();
        const buses = await db.buses.getAll();

        if (students.length > 0 && buses.length > 0) {
          const attendanceData = buses.slice(0, 6).map(bus => {
            const present = students.filter(s => s.bus === bus.busNumber).length;
            return {
              name: bus.busNumber,
              present: present,
              total: 50 // Default capacity
            };
          });
          setBusAttendance(attendanceData);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <SupabaseTest />
          <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span>{isSupabaseConfigured ? 'Live Data Sync Active' : 'Offline / Mock Data'}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Students per Bus */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Students Present per Bus</h2>
            <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-dps-teal rounded-sm"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-slate-300 rounded-sm"></div>
                <span>Capacity</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={busAttendance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="total" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="present" fill="#004b61" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trip Overview Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Buses per Trip</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tripData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tripData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {tripData.map((trip) => (
              <div key={trip.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: trip.color }}></div>
                  <span className="text-gray-600 font-medium">{trip.name}</span>
                </div>
                <span className="font-bold text-gray-900">{trip.value} Buses</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-dps-teal/10 text-dps-teal rounded-lg">
              <MapPin size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Live Bus Tracking</h2>
          </div>
          <div className="flex space-x-2">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              34 On Route
            </span>
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              4 Delayed
            </span>
          </div>
        </div>
        
        <div className="relative bg-dps-cream/30 rounded-xl overflow-hidden h-[400px] border border-dashed border-gray-300">
          {/* Mock Map Background - Using a subtle pattern or simple grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#004b61 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
          
          {/* Mock Roads */}
          <div className="absolute top-1/4 left-0 w-full h-8 bg-gray-200/50 -skew-y-2"></div>
          <div className="absolute top-0 left-1/3 w-8 h-full bg-gray-200/50 skew-x-2"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-8 bg-gray-200/50 skew-y-1"></div>

          {/* Bus Markers */}
          {BUS_LOCATIONS.map((loc) => (
            <div 
              key={loc.id}
              className="absolute group cursor-pointer"
              style={{ top: `${loc.lat}%`, left: `${loc.lng}%` }}
            >
              <div className="relative">
                {/* Ping Animation for Moving Buses */}
                {loc.status === 'Moving' && (
                  <div className="absolute inset-0 bg-dps-teal rounded-full animate-ping opacity-75"></div>
                )}
                
                {/* Marker */}
                <div className={`p-1.5 rounded-full shadow-lg relative z-10 ${
                  loc.status === 'Moving' ? 'bg-dps-teal text-white' : 
                  loc.status === 'Delayed' ? 'bg-red-500 text-white' : 
                  'bg-orange-400 text-white'
                }`}>
                  <Bus size={14} />
                </div>

                {/* Info Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-white rounded-lg shadow-xl border border-gray-100 p-2 z-20">
                  <p className="text-xs font-bold text-gray-900">{loc.bus}</p>
                  <p className={`text-[10px] font-medium ${
                    loc.status === 'Moving' ? 'text-green-600' : 
                    loc.status === 'Delayed' ? 'text-red-600' : 
                    'text-orange-600'
                  }`}>{loc.status}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 text-gray-600">
              <Plus size={18} />
            </button>
            <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold">
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
