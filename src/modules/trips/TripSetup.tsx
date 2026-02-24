import { useState, useEffect } from 'react';
import { Plus, Eye, Trash2, MapPin, Bus, Users, Search, UserSquare2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { db } from '../../services/db';


export const TripSetup = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [availableBuses, setAvailableBuses] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [tripsData, busesData, studentsData] = await Promise.all([
        db.trips.getAll(),
        db.buses.getAll(),
        db.students.getAll()
      ]);
      setTrips(tripsData);
      setAvailableBuses(busesData);
      setAvailableStudents(studentsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredTrips = trips.filter(t => 
    t.firstStop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.lastStop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.drivers?.some((d: string) => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleView = (trip: any) => {
    setCurrentTrip(trip);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstStop = formData.get('firstStop') as string;
    const lastStop = formData.get('lastStop') as string;
    
    // In a real app, these would be multi-select values
    const selectedBuses = formData.getAll('buses') as string[];
    const selectedStudents = formData.getAll('students') as string[];
    const stopsStr = formData.get('stops') as string;
    const stopsList = stopsStr.split(',').map(s => s.trim()).filter(s => s !== '');

    const newTrip = {
      id: trips.length + 1,
      firstStop,
      lastStop,
      buses: selectedBuses.length > 0 ? selectedBuses : (availableBuses.length > 0 ? [availableBuses[0].busNumber] : []),
      drivers: ['Local Driver'], // Placeholder for mock data
      stops: stopsList.length > 0 ? stopsList : [firstStop, lastStop],
      students: selectedStudents.length > 0 ? selectedStudents : (availableStudents.length > 0 ? [availableStudents[0].name] : []),
    };

    setTrips(prev => [...prev, newTrip]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Trip Setup</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search trips..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <Button className="space-x-2" onClick={handleAdd}>
            <Plus size={18} />
            <span>Add Trip</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Trip Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">First Stop</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Last Stop</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Drivers</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">Buses</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">Stops</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">Students</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 italic animate-pulse">
                    Loading trip configurations...
                  </td>
                </tr>
              ) : filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {trip.firstStop} → {trip.lastStop}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{trip.firstStop}</td>
                    <td className="px-6 py-4 text-gray-600">{trip.lastStop}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {trip.drivers?.length > 0 ? (
                          trip.drivers.map((d: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-xs">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                        {trip.buses.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-bold">
                        {trip.stops.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold">
                        {trip.students.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => handleView(trip)}>
                          <Eye size={14} />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(trip.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 italic">
                    No trips found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Trip: ${currentTrip?.firstStop} → ${currentTrip?.lastStop}`}
        className="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col max-h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-dps-teal">
                  <Bus size={18} />
                  <h3 className="font-bold text-sm">Buses</h3>
                </div>
                <span className="bg-white px-1.5 py-0.5 rounded border text-[10px] font-bold text-dps-teal">
                  {currentTrip?.buses.length}
                </span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 overflow-y-auto pr-1">
                {currentTrip?.buses.map((bus: string, i: number) => {
                  const fallbackDriver = availableBuses.find(b => b.busNumber === bus)?.driver || 'Unassigned';
                  const driverName = (currentTrip?.drivers && currentTrip.drivers[i]) ? currentTrip.drivers[i] : fallbackDriver;
                  return (
                    <li key={bus} className="py-1 border-b border-gray-100 last:border-0 flex items-center justify-between">
                      <span className="font-medium text-gray-800">{bus}</span>
                      <span className="text-xs text-gray-500">{driverName}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col max-h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-indigo-600">
                  <UserSquare2 size={18} />
                  <h3 className="font-bold text-sm">Drivers</h3>
                </div>
                <span className="bg-white px-1.5 py-0.5 rounded border text-[10px] font-bold text-indigo-600">
                  {currentTrip?.drivers?.length || 0}
                </span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 overflow-y-auto pr-1">
                {currentTrip?.drivers?.map((driver: string, i: number) => (
                  <li key={i} className="py-1 border-b border-gray-100 last:border-0">{driver}</li>
                ))}
                {(!currentTrip?.drivers || currentTrip.drivers.length === 0) && (
                  <li className="text-gray-400 italic py-1">No drivers assigned</li>
                )}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col max-h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-orange-600">
                  <MapPin size={18} />
                  <h3 className="font-bold text-sm">Stops</h3>
                </div>
                <span className="bg-white px-1.5 py-0.5 rounded border text-[10px] font-bold text-orange-600">
                  {currentTrip?.stops.length}
                </span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 overflow-y-auto pr-1">
                {currentTrip?.stops.map((stop: string, i: number) => (
                  <li key={i} className="py-1 border-b border-gray-100 last:border-0 flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                      {i + 1}
                    </span>
                    <span>{stop}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col max-h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-green-600">
                  <Users size={18} />
                  <h3 className="font-bold text-sm">Students</h3>
                </div>
                <span className="bg-white px-1.5 py-0.5 rounded border text-[10px] font-bold text-green-600">
                  {currentTrip?.students.length}
                </span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 overflow-y-auto pr-1">
                {currentTrip?.students.map((student: string) => (
                  <li key={student} className="py-1 border-b border-gray-100 last:border-0">{student}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Trip Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Trip"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Stop" name="firstStop" required placeholder="e.g. Sector 15" />
            <Input label="Last Stop" name="lastStop" required placeholder="e.g. Sector 62" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Assigned Buses</label>
            <select name="buses" multiple className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal min-h-[100px]">
              {availableBuses.map(bus => (
                <option key={bus.id} value={bus.busNumber}>{bus.busNumber}</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-500">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mapped Students</label>
            <select name="students" multiple className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal min-h-[100px]">
              {availableStudents.map(student => (
                <option key={student.id} value={student.name}>{student.name}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Stops (Comma separated)" 
            name="stops" 
            placeholder="Stop 1, Stop 2, Stop 3" 
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Trip
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
