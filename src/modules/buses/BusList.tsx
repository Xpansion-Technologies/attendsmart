import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { SearchableSelect } from '../../components/ui/SearchableSelect';
import { db } from '../../services/db';

export const BusList = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBus, setCurrentBus] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | number>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [busesData, driversData] = await Promise.all([
        db.buses.getAll(),
        db.drivers.getAll()
      ]);
      setBuses(busesData);
      setDrivers(driversData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const driverOptions = drivers.map(d => ({ id: d.name, label: d.name }));

  const filteredBuses = buses.filter(b => 
    b.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.shift.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentBus(null);
    setSelectedDriver('');
    setIsModalOpen(true);
  };

  const handleEdit = (bus: any) => {
    setCurrentBus(bus);
    setSelectedDriver(bus.driver);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setBuses(prev => prev.filter(b => b.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const busData = {
      busNumber: formData.get('busNumber') as string,
      shift: formData.get('shift') as string,
      driver: formData.get('driver') as string,
      route: formData.get('route') as string,
    };

    if (currentBus) {
      setBuses(prev => prev.map(b => b.id === currentBus.id ? { ...b, ...busData } : b));
    } else {
      setBuses(prev => [...prev, { id: prev.length + 1, ...busData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Buses</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search buses..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <Button className="space-x-2" onClick={handleAdd}>
            <Plus size={18} />
            <span>Add Bus</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">#</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Bus Number</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Shift</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Driver</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Route</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic animate-pulse">
                    Loading buses...
                  </td>
                </tr>
              ) : filteredBuses.length > 0 ? (
                filteredBuses.map((bus, index) => (
                  <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{bus.busNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bus.shift === 'Morning' ? 'bg-blue-100 text-blue-700' : 
                        bus.shift === 'Afternoon' ? 'bg-orange-100 text-orange-700' : 
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {bus.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{bus.driver}</td>
                    <td className="px-6 py-4 text-gray-600">{bus.route}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(bus)}>
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(bus.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">
                    No buses found matching your search.
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
        title={currentBus ? 'Edit Bus' : 'Add Bus'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Bus Number" 
            name="busNumber" 
            defaultValue={currentBus?.busNumber} 
            required 
            placeholder="BUS-101"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Shift</label>
              <select 
                name="shift" 
                defaultValue={currentBus?.shift || 'Morning'}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal transition-all"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <SearchableSelect
              label="Driver Name"
              name="driver"
              options={driverOptions}
              value={selectedDriver}
              onChange={setSelectedDriver}
              required
              placeholder="Select Driver"
            />
          </div>
          <Input 
            label="Route" 
            name="route" 
            defaultValue={currentBus?.route} 
            required 
            placeholder="Sector 15 - Sector 62"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {currentBus ? 'Save Changes' : 'Add Bus'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
