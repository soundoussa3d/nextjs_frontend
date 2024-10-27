// src/components/Modal.tsx
import React from 'react';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
  isEdit: boolean;
  users: { _id: string; name: string }[];
}

const ModalAgent: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData,isEdit, users}) => {
  const [formData, setFormData] = React.useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev:object) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit SRM' : 'Add New SRM'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Firstname:</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Lastname:</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Telephone:</label>
            <input
              type="tel"
              name="teleph"
              value={formData.teleph}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Select Departements:</label>
            <select
  value={formData.departementId}  // adminId
  onChange={(e) => setFormData({ ...formData, departementId: e.target.value })} className="border p-2 w-full"
>
  <option value="">Select Region</option>
  {users.map(user => (
    <option 
    key={user._id} 
    value={user._id}
    className="border p-2 w-full">{user.name}</option>
  ))}
</select>
          </div>
          
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">  {isEdit ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgent;
