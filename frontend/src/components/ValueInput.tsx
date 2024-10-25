import { useState } from 'react';

interface ValueInputProps {
  values: string[]; // Initial values passed from parent
  onChange: (newValues: string[]) => void; // Callback to update parent state
}

const ValueInput: React.FC<ValueInputProps> = ({ values, onChange }) => {
  const [inputValue, setInputValue] = useState<string>(''); // Store input value

  // Handle input field change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Add value to the list
  const handleAddValue = () => {
    if (inputValue.trim() !== '') {
      const updatedValues = [...values, inputValue.trim()];
      onChange(updatedValues); // Update parent state
      setInputValue(''); // Clear input field
    }
  };

  // Remove value from the list by index
  const handleDeleteValue = (index: number) => {
    const updatedValues = values.filter((_, i) => i !== index);
    onChange(updatedValues); // Update parent state
  };

  return (
    <div className="p-2">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a value"
          className="border border-gray-300 px-4 py-2 mr-2 rounded"
        />
        <button
          onClick={handleAddValue}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="list-disc ml-6">
        {values.map((value, index) => (
          <li key={index} className="mb-2 flex items-center">
            <span className="mr-2">{value}</span>
            <button
              onClick={() => handleDeleteValue(index)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValueInput;
