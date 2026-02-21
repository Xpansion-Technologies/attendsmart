import { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const INITIAL_PARENTS = [
  { id: 1, name: 'Parent One', email: 'parent1@example.com', phone: '+91 98123 45678', address: 'B-12, Sector 15, Noida' },
  { id: 2, name: 'Parent Two', email: 'parent2@example.com', phone: '+91 98123 45679', address: 'C-45, Indirapuram, Ghaziabad' },
  { id: 3, name: 'Parent Three', email: 'parent3@example.com', phone: '+91 98123 45680', address: 'Flat 201, Green View Apartments, Sector 62' },
  { id: 4, name: 'Parent Four', email: 'parent4@example.com', phone: '+91 98123 45681', address: 'D-89, Crossing Republik, Ghaziabad' },
  { id: 5, name: 'Parent Five', email: 'parent5@example.com', phone: '+91 98123 45682', address: 'House 12, Alpha 1, Greater Noida' },
];

export const ParentList = () => {
  const [parents, setParents] = useState(INITIAL_PARENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParent, setCurrentParent] = useState<any>(null);

  const handleAdd = () => {
    setCurrentParent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (parent: any) => {
    setCurrentParent(parent);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setParents(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parentData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };

    if (currentParent) {
      setParents(prev => prev.map(p => p.id === currentParent.id ? { ...p, ...parentData } : p));
    } else {
      setParents(prev => [...prev, { id: prev.length + 1, ...parentData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Parents</h1>
        <div className="flex space-x-3">
          <Button className="space-x-2" onClick={handleAdd}>
            <Plus size={18} />
            <span>Add Parent</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">#</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {parents.map((parent) => (
              <tr key={parent.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-600">{parent.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{parent.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail size={14} className="text-gray-400" />
                    <span>{parent.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone size={14} className="text-gray-400" />
                    <span>{parent.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate max-w-xs">{parent.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(parent)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(parent.id)}>
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
        title={currentParent ? 'Edit Parent' : 'Add Parent'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Full Name" 
            name="name" 
            defaultValue={currentParent?.name} 
            required 
            placeholder="Parent One"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email Address" 
              name="email" 
              type="email"
              defaultValue={currentParent?.email} 
              required 
              placeholder="parent@example.com"
            />
            <Input 
              label="Phone Number" 
              name="phone" 
              defaultValue={currentParent?.phone} 
              required 
              placeholder="+91 98123 45678"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea 
              name="address" 
              defaultValue={currentParent?.address} 
              required 
              placeholder="B-12, Sector 15, Noida"
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal transition-all"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {currentParent ? 'Save Changes' : 'Add Parent'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
