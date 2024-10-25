"use client"
// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ModalSrms from '@/components/ModalSrms';

interface User {
  _id: string;
  username: string;
}
interface SRM {
  _id: number;
  nom: string;
  status: string;
  code: string;
  adresse: string;
  email: string;
  telph: string;
  admin: string;
  // Add other relevant fields for the SRMs
}

const Dashboard = () => {
  const [srms, setSrms] = useState<SRM[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedSRM, setSelectedSRM] = useState<SRM | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchSRMs = async () => {
      try {
        const response = await fetch('http://localhost:3000/srms'); // Update this to your SRM-fetching endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch SRMs');
        }
        const data = await response.json();
        setSrms(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:3000/users?type=admin');
        if (!response.ok) throw new Error('Failed to fetch admins');
        const data = await response.json();
        setAdmins(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchSRMs();
    fetchAdmins();
  }, []);

  const handleAddNew = () => {
    setSelectedSRM(null); // Clear selected SRM
    setIsEditMode(false); // Set to add mode
    setIsModalOpen(true);
  };

  const handleEdit = (srm: SRM) => {
    setSelectedSRM(srm);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedData: SRM) => {
    try {
      const response = isEditMode
        ? await fetch(`http://localhost:3000/srms/${updatedData._id}`, {
            method: 'Put',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
          })
        : await fetch('http://localhost:3000/srms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
          });

      if (!response.ok) {
        throw new Error('Failed to save SRM');
      }

      // Update the local state accordingly
      if (isEditMode) {
        setSrms(srms.map(srm => (srm._id === updatedData._id ? updatedData : srm)));
      } else {
        const newSRM = await response.json(); // Get the newly added SRM
        setSrms([...srms, newSRM]); // Add new SRM to the list
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsModalOpen(false); // Close the modal after save
    }
  };

  const handleDelete = async (id: number) => {
    // Implement delete functionality here
    try {
      const response = await fetch(`http://localhost:3000/srms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete SRM');
      }

      // Remove the SRM from the state
      setSrms(srms.filter(srm => srm._id !== id));
      console.log(`Deleted SRM with id: ${id}`);
    } catch (err) {
        const error = err as Error;
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout>
    <div className="p-6">
      <h1 className="text-2xl font-bold">SRM List</h1>
      <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Add New SRM
        </button>
      
      <table className="min-w-full mt-4 border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
          <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Code</th>
            <th className="px-4 py-2 border">Adresse</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Admin</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
        {srms.map((srm) => {
    const admin = admins.find(admin => admin._id === srm.admin); // Find the admin by ID
    return (
      <tr key={srm._id} className="border-b">
        <td className="px-4 py-2 border">{srm.nom}</td>
        <td className="px-4 py-2 border">{srm.code}</td>
        <td className="px-4 py-2 border">{srm.adresse}</td>
        <td className="px-4 py-2 border">{srm.email}</td>
        <td className="px-4 py-2 border">{srm.telph}</td>
        {/* Display admin username if available */}
        <td className="px-4 py-2 border">{admin ? admin.username : 'No Admin Assigned'}</td>
        <td className="px-4 py-2 border">{srm.status}</td>
        <td className="px-4 py-2 border">
          <button
            onClick={() => handleEdit(srm)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(srm._id)}
            className="ml-4 text-red-600 hover:underline"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  })}
        </tbody>
      </table>
      {isModalOpen && (
          <ModalSrms
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={selectedSRM || { nom: '', code: '', adresse: '', email: '', telph: '', admin :'', status: 'inactive' }}
            isEdit={isEditMode}
            users={admins}
          />
        )}
    </div>
    </Layout>
  );
};

export default Dashboard;
