import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { SearchableSelect } from '../../components/ui/SearchableSelect';
import { db } from '../../services/db';

export const StudentList = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [selectedGuardian, setSelectedGuardian] = useState<string | number>('');
  const [selectedBus, setSelectedBus] = useState<string | number>('');
  const [tableSearchTerm, setTableSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [studentsData, parentsData, busesData] = await Promise.all([
        db.students.getAll(),
        db.parents.getAll(),
        db.buses.getAll()
      ]);
      setStudents(studentsData);
      setParents(parentsData);
      setBuses(busesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const parentOptions = parents.map(p => ({ id: p.name, label: p.name }));
  const busOptions = buses.map(b => ({ id: b.busNumber, label: b.busNumber }));

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
    s.guardian.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
    s.bus.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(tableSearchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentStudent(null);
    setSelectedGuardian('');
    setSelectedBus('');
    setIsModalOpen(true);
  };

  const handleEdit = (student: any) => {
    setCurrentStudent(student);
    setSelectedGuardian(student.guardian);
    setSelectedBus(student.bus);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentData = {
      name: formData.get('name') as string,
      class: formData.get('class') as string,
      guardian: formData.get('guardian') as string,
      bus: formData.get('bus') as string,
      nfc: formData.get('nfc') as string || Math.random().toString(36).substring(2, 12).toUpperCase(),
    };

    if (currentStudent) {
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, ...studentData } : s));
    } else {
      setStudents(prev => [...prev, { id: prev.length + 1, ...studentData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal bg-white"
              value={tableSearchTerm}
              onChange={(e) => setTableSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <Button variant="outline">
            Export QR PDF
          </Button>
          <Button className="space-x-2" onClick={handleAdd}>
            <Plus size={18} />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">#</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Class</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Guardian</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Bus</th>
                <th className="px-6 py-4 font-semibold text-gray-700">NFC UID</th>
                <th className="px-6 py-4 font-semibold text-gray-700">QR</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 italic animate-pulse">
                    Loading students from database...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-gray-600">{student.class}</td>
                    <td className="px-6 py-4 text-gray-600">{student.guardian}</td>
                    <td className="px-6 py-4 text-gray-600">{student.bus}</td>
                    <td className="px-6 py-4 font-mono text-gray-500">{student.nfc}</td>
                    <td className="px-6 py-4">
                      <div className="p-1 bg-white border border-gray-100 rounded-lg inline-block shadow-sm">
                        <QRCodeSVG 
                          value={student.id.toString()} 
                          size={40}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(student)}>
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(student.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 italic">
                    No students found matching your search.
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
        title={currentStudent ? 'Edit Student' : 'Add Student'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Full Name" 
            name="name" 
            defaultValue={currentStudent?.name} 
            required 
            placeholder="John Doe"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Class" 
              name="class" 
              defaultValue={currentStudent?.class} 
              required 
              placeholder="5A"
            />
            <SearchableSelect
              label="Bus Assignment"
              name="bus"
              options={busOptions}
              value={selectedBus}
              onChange={setSelectedBus}
              required
              placeholder="Select Bus"
            />
          </div>
          <SearchableSelect
            label="Guardian Name"
            name="guardian"
            options={parentOptions}
            value={selectedGuardian}
            onChange={setSelectedGuardian}
            required
            placeholder="Select Guardian"
          />
          <Input 
            label="NFC UID (Optional)" 
            name="nfc" 
            defaultValue={currentStudent?.nfc} 
            placeholder="Auto-generated if left blank"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {currentStudent ? 'Save Changes' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
