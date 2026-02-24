import { useState, useEffect } from 'react';
import { Eye, Clock, User, Bus as BusIcon, Calendar, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { db } from '../../services/db';

const INITIAL_ATTENDANCE = [
  {
    id: 1,
    dateTime: '2026-02-21 07:30',
    trip: 'Morning Pickup',
    driverName: 'Sanjay Kumar',
    busNumber: 'BUS-101',
    attendance: [
      { id: 1, name: 'Rahul Sharma', status: 'Present', time: '07:35 AM' },
      { id: 2, name: 'Mohan Shukla', status: 'Present', time: '07:42 AM' },
      { id: 3, name: 'Student 2', status: 'Absent', time: '-' },
      { id: 4, name: 'Student 3', status: 'Present', time: '07:50 AM' },
      { id: 5, name: 'Student 4', status: 'Absent', time: '-' },
    ]
  },
  {
    id: 2,
    dateTime: '2026-02-21 08:15',
    trip: 'Morning Pickup',
    driverName: 'Amit Singh',
    busNumber: 'BUS-102',
    attendance: [
      { id: 6, name: 'Student 5', status: 'Present', time: '08:20 AM' },
      { id: 7, name: 'Student 6', status: 'Present', time: '08:25 AM' },
      { id: 8, name: 'Student 7', status: 'Present', time: '08:30 AM' },
    ]
  },
  {
    id: 3,
    dateTime: '2026-02-20 14:30',
    trip: 'Afternoon Drop',
    driverName: 'Ramesh Pal',
    busNumber: 'BUS-103',
    attendance: [
      { id: 1, name: 'Rahul Sharma', status: 'Present', time: '02:35 PM' },
      { id: 2, name: 'Mohan Shukla', status: 'Present', time: '02:45 PM' },
      { id: 3, name: 'Student 2', status: 'Present', time: '02:50 PM' },
    ]
  },
  {
    id: 4,
    dateTime: '2026-02-20 15:15',
    trip: 'Afternoon Drop',
    driverName: 'Vijay Tyagi',
    busNumber: 'BUS-104',
    attendance: [
      { id: 4, name: 'Student 3', status: 'Present', time: '03:20 PM' },
      { id: 5, name: 'Student 4', status: 'Absent', time: '-' },
    ]
  },
];

export const AttendanceList = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await db.attendance.getAll();
      if (data) {
        setAttendance(data);
      } else {
        setAttendance(INITIAL_ATTENDANCE);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredAttendance = attendance.filter(log => 
    log.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.trip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.dateTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (trip: any) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Logs</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2 text-sm text-gray-600 shadow-sm">
            <Calendar size={16} />
            <span>Feb 21, 2026</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Date/Time</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Trip</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Driver Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Bus Number</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic animate-pulse">
                    Fetching live attendance logs...
                  </td>
                </tr>
              ) : filteredAttendance.length > 0 ? (
                filteredAttendance.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{log.dateTime.split(' ')[0]}</span>
                        <span className="text-xs text-gray-500">{log.dateTime.split(' ')[1]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.trip.includes('Morning') ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {log.trip}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-gray-400" />
                        <span>{log.driverName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <BusIcon size={14} className="text-gray-400" />
                        <span className="font-mono">{log.busNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="space-x-1.5"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                    No logs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Trip Details: ${selectedTrip?.trip} (${selectedTrip?.busNumber})`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 uppercase font-semibold">Driver</span>
              <p className="text-sm font-medium text-gray-900">{selectedTrip?.driverName}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-xs text-gray-500 uppercase font-semibold">Date & Time</span>
              <p className="text-sm font-medium text-gray-900">{selectedTrip?.dateTime}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <span>Student Attendance</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px]">
                {selectedTrip?.attendance.length} Total
              </span>
            </h3>
            <div className="border rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Student Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-right">Scan Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedTrip?.attendance.map((student: any) => (
                    <tr key={student.id}>
                      <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 flex items-center justify-end space-x-1.5">
                        <Clock size={12} className="text-gray-300" />
                        <span>{student.time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
