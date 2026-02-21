import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const INITIAL_DRIVERS = [
  { id: 1, name: 'Sanjay Kumar', username: 'sanjay.k', password: 'password123', phone: '+91 98765 43210' },
  { id: 2, name: 'Amit Singh', username: 'amit.s', password: 'password123', phone: '+91 98765 43211' },
  { id: 3, name: 'Ramesh Pal', username: 'ramesh.p', password: 'password123', phone: '+91 98765 43212' },
  { id: 4, name: 'Vijay Tyagi', username: 'vijay.t', password: 'password123', phone: '+91 98765 43213' },
  { id: 5, name: 'Rajesh Sharma', username: 'rajesh.s', password: 'password123', phone: '+91 98765 43214' },
];

export const DriverList = () => {
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<any>(null);

  const togglePassword = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = () => {
    setCurrentDriver(null);
    setIsModalOpen(true);
  };

  const handleEdit = (driver: any) => {
    setCurrentDriver(driver);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const driverData = {
      name: formData.get('name') as string,
      username: formData.get('username') as string,
      password: (formData.get('password') as string) || (currentDriver?.password as string) || 'password123',
      phone: formData.get('phone') as string,
    };

    if (currentDriver) {
      setDrivers(prev => prev.map(d => d.id === currentDriver.id ? { ...d, ...driverData } : d));
    } else {
      setDrivers(prev => [...prev, { id: prev.length + 1, ...driverData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Drivers</h1>
        <div className="flex space-x-3">
          <Button className="space-x-2" onClick={handleAdd}>
            <Plus size={18} />
            <span>Add Driver</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">#</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Username</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Password</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-600">{driver.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{driver.name}</td>
                <td className="px-6 py-4 text-gray-600">{driver.username}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-600">
                      {showPasswords[driver.id] ? driver.password : '••••••••'}
                    </span>
                    <button 
                      onClick={() => togglePassword(driver.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords[driver.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{driver.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(driver)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(driver.id)}>
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
        title={currentDriver ? 'Edit Driver' : 'Add Driver'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Full Name" 
            name="name" 
            defaultValue={currentDriver?.name} 
            required 
            placeholder="Sanjay Kumar"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Username" 
              name="username" 
              defaultValue={currentDriver?.username} 
              required 
              placeholder="sanjay.k"
            />
            <Input 
              label="Password" 
              name="password" 
              type="password"
              placeholder={currentDriver ? 'Leave blank to keep same' : '••••••••'}
              required={!currentDriver}
            />
          </div>
          <Input 
            label="Phone Number" 
            name="phone" 
            defaultValue={currentDriver?.phone} 
            required 
            placeholder="+91 98765 43210"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {currentDriver ? 'Save Changes' : 'Add Driver'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
