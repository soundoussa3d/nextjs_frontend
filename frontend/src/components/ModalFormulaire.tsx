import React, { useState } from 'react';
import ValueInput from './ValueInput';


interface ModalFormulaireProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
  isEdit: boolean;
}

const ModalFormulaire: React.FC<ModalFormulaireProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit,
}) => {
  const [formData, setFormData] = useState(initialData);

  // Handle input field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? 'Edit Formulaire' : 'Add New Formulaire'}
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Form Name"
          className="border border-gray-300 px-4 py-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border border-gray-300 px-4 py-2 mb-4 w-full rounded"
        />

        {/* ValueInput for nameOfValues */}
        <ValueInput
          values={formData.nameOfValues}
          onChange={(newValues) =>
            setFormData((prev) => ({ ...prev, nameOfValues: newValues }))
          }
        />

        {/* ValueInput for units */}
        <ValueInput
          values={formData.units}
          onChange={(newUnits) =>
            setFormData((prev) => ({ ...prev, units: newUnits }))
          }
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ModalFormulaire;
