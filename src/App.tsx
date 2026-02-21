import { useState } from 'react';
import { Layout } from './components/shared/Layout';
import { StudentList } from './modules/students/StudentList';
import { BusList } from './modules/buses/BusList';
import { DriverList } from './modules/drivers/DriverList';
import { ParentList } from './modules/parents/ParentList';
import { Dashboard } from './modules/dashboard/Dashboard';

import { AttendanceList } from './modules/attendance/AttendanceList';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Students':
        return <StudentList />;
      case 'Buses':
        return <BusList />;
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
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
