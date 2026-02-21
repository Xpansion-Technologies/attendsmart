import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const INITIAL_BUSES = [
  { id: 1, busNumber: 'BUS-101', shift: 'Morning', driver: 'Sanjay Kumar', route: 'Sector 15 - Sector 62' },
  { id: 2, busNumber: 'BUS-102', shift: 'Morning', driver: 'Amit Singh', route: 'Indirapuram - Vaishali' },
  { id: 3, busNumber: 'BUS-103', shift: 'Evening', driver: 'Ramesh Pal', route: 'Noida City Center - Crossing Republik' },
  { id: 4, busNumber: 'BUS-104', shift: 'Morning', driver: 'Vijay Tyagi', route: 'Greater Noida West - Pari Chowk' },
  { id: 5, busNumber: 'BUS-105', shift: 'Afternoon', driver: 'Rajesh Sharma', route: 'Delhi Border - Noida Expressway' },
];

export const BusList = () => {
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBus, setCurrentBus] = useState<any>(null);

  const handleAdd = () => {
    setCurrentBus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bus: any) => {
    setCurrentBus(bus);
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
        <div className="flex space-x-3">
          <Button className="space-x-2" onClick={handleAdd}>
            <Plus size={18} />
            <span>Add Bus</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
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
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-600">{bus.id}</td>
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
            ))}
          </tbody>
        </table>
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
            <Input 
              label="Driver Name" 
              name="driver" 
              defaultValue={currentBus?.driver} 
              required 
              placeholder="Sanjay Kumar"
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
