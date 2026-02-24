import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './modules/auth/Login';
import { Layout } from './components/shared/Layout';
import { StudentList } from './modules/students/StudentList';
import { BusList } from './modules/buses/BusList';
import { DriverList } from './modules/drivers/DriverList';
import { ParentList } from './modules/parents/ParentList';
import { Dashboard } from './modules/dashboard/Dashboard';
import { TripSetup } from './modules/trips/TripSetup';
import { AttendanceList } from './modules/attendance/AttendanceList';
import { Loader2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dps-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-dps-teal animate-spin mx-auto" />
          <p className="text-dps-teal font-medium">Loading AttendSmart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Students':
        return <StudentList />;
      case 'Buses':
        return <BusList />;
      case 'Trip Setup':
        return <TripSetup />;
      case 'Drivers':
        return <DriverList />;
      case 'Parents':
        return <ParentList />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Attendance':
        return <AttendanceList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      userProfile={profile}
      onLogout={signOut}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
