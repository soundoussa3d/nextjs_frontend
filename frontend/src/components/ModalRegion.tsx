import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
  isEdit: boolean;
  users: { _id: string; username: string }[]; // Managers (users) list
}

const ModalRegions: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit,
  users,
}) => {
  const [formData, setFormData] = React.useState(initialData);

  /*useEffect(() => {
    setFormData(initialData); // Ensure form data updates when the initial data changes
  }, [initialData]);*/

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev:object) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData :" , formData);
    onSave(formData); // Pass the form data back to the parent component
    onClose(); // Close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Region' : 'Add New Region'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}  // Ensuring form is controlled
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Adresse:</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
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
            <label className="block mb-1">Phone:</label>
            <input
              type="tel"
              name="telph"
              value={formData.telph}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Status:</label>
            <select
              name="status"
              value={formData.status || 'inactive'}  // Default to 'inactive'
              onChange={handleChange}
              className="border p-2 w-full"
              required
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Select Manager:</label>
            <select
              name="managerId"
              value={formData.managerId}  // Ensure controlled component
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })} // Use handleChange for consistency
              className="border p-2 w-full"
            >
              <option value="">Select a Manager</option>
              {users.map(manager => (
                <option key={manager._id} value={manager._id.toString()}>
                  {manager.username}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegions;
