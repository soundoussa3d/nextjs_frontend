"use client";
// src/app/admins/page.tsx
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';  // Import Modal component
import EditForm from '../../components/EditForm';  // Import EditForm component
import FormManager from '@/components/FormManager';

interface Manager {
  _id?: string;  // Use MongoDB _id for identification
  username: string;
  nom:string // 
}

const Admins = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Fetch admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:3000/users?type=manager'); // Adjust your endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }
        const data = await response.json();
        setManagers(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Handle adding a new admin
  const handleAddNew = () => {
    setSelectedManager(null); // Clear selected admin
    setIsEditMode(false);  // Set to "add" mode
    setModalOpen(true);  // Open modal
  };

  // Handle editing an existing admin
  const handleEdit = (admin: Manager) => {
    setSelectedManager(admin);  // Set the admin to be edited
    setIsEditMode(true);  // Set to "edit" mode
    setModalOpen(true);  // Open modal
  };

  // Close modal and reset the selected admin
  const handleCloseModal = () => {
    setModalOpen(false);  // Close modal
    setSelectedManager(null);  // Reset selected admin
  };

  // Save admin (both add and edit)
  const handleSave = async (adminData: Manager) => {
    try {
      const add={...adminData,type:'manager'}
      const response = isEditMode
        ? await fetch(`http://localhost:3000/users/${adminData._id}`, {
            method: 'PUT',  // For updating existing admin
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),
          })
        : await fetch('http://localhost:3000/users/manager', {
            method: 'POST',  // For adding a new admin
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(add),
          });

      if (!response.ok) {
        throw new Error('Failed to save manager');
      }

      if (isEditMode) {
        // Update the list with the modified admin
        setManagers(managers.map(admin => (admin._id === adminData._id ? adminData : admin)));
      } else {
        // Add the newly created admin to the list
        const newAdmin = await response.json();
        setManagers([...managers, newAdmin.user]);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      handleCloseModal();  // Close modal after save
    }
  };

  // Delete admin
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete manager');
      }

      // Remove the admin from the list
      setManagers(managers.filter(admin => admin._id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin List</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Add New Admin
        </button>
        <table className="min-w-full mt-4 border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager._id} className="border-b">
                <td className="px-4 py-2 border">{manager.nom}</td>
                <td className="px-4 py-2 border">{manager.username}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(manager)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit  
                  </button>
                  <button
                    onClick={() => handleDelete(manager._id!)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for adding or editing admin */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <FormManager
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
          initialData={selectedManager || { username: '',
            nom:'' }}
          onSave={handleSave}
          isEdit={isEditMode}
        />
      </Modal>
    </Layout>
  );
};

export default Admins;
