import { useState } from 'react';
import { Layout } from './components/shared/Layout';
import { StudentList } from './modules/students/StudentList';
import { BusList } from './modules/buses/BusList';
import { DriverList } from './modules/drivers/DriverList';
import { ParentList } from './modules/parents/ParentList';

import { AttendanceList } from './modules/attendance/AttendanceList';

function App() {
  const [activeTab, setActiveTab] = useState('Students');

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
        return (
          <div className="flex items-center justify-center h-64 text-gray-400">
            Dashboard view coming soon...
          </div>
        );
      case 'Attendance':
        return <AttendanceList />;
      default:
        return <StudentList />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
