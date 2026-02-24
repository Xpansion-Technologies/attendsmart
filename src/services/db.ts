import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  INITIAL_STUDENTS, 
  INITIAL_BUSES, 
  INITIAL_PARENTS, 
  INITIAL_DRIVERS, 
  INITIAL_TRIPS 
} from './mockData';

/**
 * Service to handle data fetching from Supabase with fallback to mock data.
 * This allows for testing the UI even if the database is not fully populated.
 */

export const db = {
  students: {
    async getAll() {
      if (!isSupabaseConfigured || !supabase) {
        return INITIAL_STUDENTS;
      }
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*, parent:parents(name), bus:buses(bus_number)');
        
        if (error) {
          console.warn('Error fetching students, using mock data:', error.message);
          return INITIAL_STUDENTS;
        }

        if (!data || data.length === 0) return INITIAL_STUDENTS;

        // Map relational data to match UI expectations
        return data.map((s: any) => ({
          id: s.id,
          name: s.name,
          class: s.class,
          guardian: Array.isArray(s.parent) ? s.parent[0]?.name : (s.parent?.name || 'No Guardian'),
          bus: Array.isArray(s.bus) ? s.bus[0]?.bus_number : (s.bus?.bus_number || 'No Bus'),
          nfc: s.nfc_uid || '-'
        }));
      } catch (err) {
        console.error('Supabase students fetch failed:', err);
        return INITIAL_STUDENTS;
      }
    },
  },

  buses: {
    async getAll() {
      if (!isSupabaseConfigured || !supabase) {
        return INITIAL_BUSES;
      }
      try {
        const { data, error } = await supabase
          .from('buses')
          .select('*, driver:profiles(full_name)');
          
        if (error) {
          console.warn('Error fetching buses, using mock data:', error.message);
          return INITIAL_BUSES;
        }

        if (!data || data.length === 0) return INITIAL_BUSES;

        return data.map((b: any) => ({
          id: b.id,
          busNumber: b.bus_number,
          shift: b.shift,
          driver: Array.isArray(b.driver) ? b.driver[0]?.full_name : (b.driver?.full_name || 'No Driver'),
          route: b.route_details || 'No Route'
        }));
      } catch (err) {
        console.error('Supabase buses fetch failed:', err);
        return INITIAL_BUSES;
      }
    }
  },

  parents: {
    async getAll() {
      if (!isSupabaseConfigured || !supabase) {
        return INITIAL_PARENTS;
      }
      try {
        const { data, error } = await supabase.from('parents').select('*');
        if (error) {
          console.warn('Error fetching parents, using mock data:', error.message);
          return INITIAL_PARENTS;
        }
        return data || INITIAL_PARENTS;
      } catch (err) {
        console.error('Supabase parents fetch failed:', err);
        return INITIAL_PARENTS;
      }
    }
  },

  drivers: {
    async getAll() {
      if (!isSupabaseConfigured || !supabase) {
        return INITIAL_DRIVERS;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'driver');
          
        if (error) {
          console.warn('Error fetching drivers, using mock data:', error.message);
          return INITIAL_DRIVERS;
        }

        if (!data || data.length === 0) return INITIAL_DRIVERS;

        return data.map((p: any) => ({
          id: p.id,
          name: p.full_name,
          username: p.full_name.toLowerCase().replace(' ', '.'),
          password: '••••••••', // Don't expose passwords in real DB fetch
          phone: p.phone || 'N/A'
        }));
      } catch (err) {
        console.error('Supabase drivers fetch failed:', err);
        return INITIAL_DRIVERS;
      }
    }
  },

  trips: {
    async getAll() {
      if (!isSupabaseConfigured || !supabase) {
        return INITIAL_TRIPS;
      }
      try {
        const { data, error } = await supabase
          .from('trips')
          .select(`
            *,
            trip_buses(buses(bus_number, driver:profiles(full_name))),
            trip_stops(stop_name),
            trip_students(students(name))
          `);
          
        if (error) {
          console.warn('Error fetching trips, using mock data:', error.message);
          return INITIAL_TRIPS;
        }

        if (!data || data.length === 0) return INITIAL_TRIPS;

        return data.map(t => ({
          id: t.id,
          firstStop: t.first_stop,
          lastStop: t.last_stop,
          buses: t.trip_buses?.map((tb: any) => tb.buses?.bus_number) || [],
          drivers: t.trip_buses?.map((tb: any) => 
            Array.isArray(tb.buses?.driver) ? tb.buses.driver[0]?.full_name : tb.buses?.driver?.full_name
          ).filter(Boolean) || [],
          stops: t.trip_stops?.map((ts: any) => ts.stop_name) || [],
          students: t.trip_students?.map((ts: any) => ts.students?.name) || []
        }));
      } catch (err) {
        console.error('Supabase trips fetch failed:', err);
        return INITIAL_TRIPS;
      }
    }
  },

  attendance: {
    async getAll() {
      if (!isSupabaseConfigured || !supabase) {
        // Mock data is inside AttendanceList.tsx currently, returning empty to indicate fallback handled by component
        return null;
      }
      try {
        const { data, error } = await supabase
          .from('attendance_logs')
          .select(`
            id,
            scan_time,
            status,
            trips(first_stop, last_stop),
            profiles(full_name),
            buses(bus_number),
            students(name)
          `);
          
        if (error) {
          console.warn('Error fetching attendance, using mock data:', error.message);
          return null;
        }

        if (!data || data.length === 0) return null;

        // Grouping logs into trips as expected by the UI
        // In a real app this would be more complex, but for PoC we group by trip_id + scan_time_hour
        const tripsMap = new Map();

        data.forEach((log: any) => {
          const tripName = `${log.trips?.first_stop} → ${log.trips?.last_stop}`;
          const date = new Date(log.scan_time);
          const dateStr = date.toISOString().split('T')[0];
          const hour = date.getHours();
          const tripKey = `${tripName}-${dateStr}-${hour}`;

          if (!tripsMap.has(tripKey)) {
            tripsMap.set(tripKey, {
              id: log.id,
              dateTime: `${dateStr} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
              trip: hour < 12 ? 'Morning Pickup' : 'Afternoon Drop',
              driverName: log.profiles?.full_name || 'Driver',
              busNumber: log.buses?.bus_number || 'N/A',
              attendance: []
            });
          }

          tripsMap.get(tripKey).attendance.push({
            id: log.id,
            name: log.students?.name || 'Unknown',
            status: log.status,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
          });
        });

        return Array.from(tripsMap.values());
      } catch (err) {
        console.error('Supabase attendance fetch failed:', err);
        return null;
      }
    }
  }
};
