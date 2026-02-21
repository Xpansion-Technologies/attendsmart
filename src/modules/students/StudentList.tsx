import { useState } from 'react';
import { QrCode, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const INITIAL_STUDENTS = [
  { id: 1, name: 'Rahul Sharma', class: '5A', guardian: 'Parent One', bus: 'BUS-101', nfc: 'RCWXIQBDGE' },
  { id: 2, name: 'Mohan Shukla', class: '1A', guardian: 'Parent 1', bus: 'BUS-101', nfc: 'DPTRYN5VL3' },
  { id: 3, name: 'Student 2', class: '1A', guardian: 'Parent 2', bus: 'BUS-101', nfc: 'WAL5CIGDQO' },
  { id: 4, name: 'Student 3', class: '1A', guardian: 'Parent 3', bus: 'BUS-101', nfc: '5CQYZLDAGN' },
  { id: 5, name: 'Student 4', class: '1A', guardian: 'Parent 4', bus: 'BUS-101', nfc: 'PRDSTSCDLP' },
  { id: 6, name: 'Student 5', class: '1A', guardian: 'Parent 5', bus: 'BUS-101', nfc: 'AJSG9YYTBQ' },
];

export const StudentList = () => {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);

  const handleAdd = () => {
    setCurrentStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: any) => {
    setCurrentStudent(student);
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
        <div className="flex space-x-3">
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
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
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
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-600">{student.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-gray-600">{student.class}</td>
                <td className="px-6 py-4 text-gray-600">{student.guardian}</td>
                <td className="px-6 py-4 text-gray-600">{student.bus}</td>
                <td className="px-6 py-4 font-mono text-gray-500">{student.nfc}</td>
                <td className="px-6 py-4">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <QrCode size={18} className="text-gray-400" />
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
            ))}
          </tbody>
        </table>
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
            <Input 
              label="Bus Assignment" 
              name="bus" 
              defaultValue={currentStudent?.bus} 
              required 
              placeholder="BUS-101"
            />
          </div>
          <Input 
            label="Guardian Name" 
            name="guardian" 
            defaultValue={currentStudent?.guardian} 
            required 
            placeholder="Guardian One"
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
