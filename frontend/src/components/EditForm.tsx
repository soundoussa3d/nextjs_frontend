// src/components/EditForm.tsx
import React, { useEffect, useState } from 'react';

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any; // Replace 'any' with your data type
  onSave: (data: any) => void; // Replace 'any' with your data type
  isEdit: boolean;
}

const EditForm: React.FC<EditFormProps> = ({ isOpen, onClose,initialData, onSave ,isEdit}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData); // Update form data when initialData changes
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Call the onSave function with updated data
  };

  if (!isOpen) return null;
  return (
    <form onSubmit={handleSubmit}>
        <div>
        <label>Name</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      
      <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">  {isEdit ? 'Update' : 'Add'}</button>
          </div>
    </form>
  );
};

export default EditForm;
