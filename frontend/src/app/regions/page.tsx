"use client";

import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ModalSrms from '@/components/ModalSrms';

interface User {
  _id: string;
  username: string;
}

interface SRM {
  _id: string;
  nom: string;
  status: string;
  code: string;
  adresse: string;
  email: string;
  telph: string;
  managerId: string;  // Manager might be null if not assigned
}

const Dashboard = () => {
  const [srms, setSrms] = useState<SRM[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedSRM, setSelectedSRM] = useState<SRM | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchSRMs = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/regions'); // Adjust endpoint if necessary
        if (!response.ok) throw new Error('Failed to fetch SRMs');
        const data = await response.json();
        console.log("data :", data);
        setSrms(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchManagers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users?type=manager');
        if (!response.ok) throw new Error('Failed to fetch managers');
        const data = await response.json();
        setManagers(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchSRMs();
    fetchManagers();
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
    console.log('Saving data:', updatedData.admin); // Log the data to be saved
    try {
        updatedData.managerId=updatedData.admin;
      const response = isEditMode
        ? await fetch(`http://localhost:3000/regions/${updatedData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
          })
        : await fetch('http://localhost:3000/regions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
          });
  
      console.log('Response:', response); // Log the response
      if (!response.ok) throw new Error('Failed to save SRM');
  
       // Get the result from the response
       // Log the result
  
      if (isEditMode) {
        setSrms(srms.map(srm => (srm._id === updatedData._id ? updatedData : srm)));
      } else {
        const result = await response.json();
        console.log('Result:', result);
        setSrms([...srms, result]);
      }
    } catch (err) {
      console.error('Error:', (err as Error).message); // Log the error
      setError((err as Error).message);
    } finally {
      setIsModalOpen(false);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/regions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete SRM');

      setSrms(srms.filter(srm => srm._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Regions List</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Add New Region
        </button>

        <table className="min-w-full mt-4 border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Adresse</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Manager</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
          {srms.map((srm) => {
            const manager = managers.find(mgr => mgr._id === srm.managerId);
            console.log("m2 :",manager)// Find the manager by ID
            return (
            <tr key={srm._id} className="border-b">
                <td className="px-4 py-2 border">{srm.nom}</td>
                <td className="px-4 py-2 border">{srm.code}</td>
                <td className="px-4 py-2 border">{srm.adresse}</td>
                <td className="px-4 py-2 border">{srm.email}</td>
                <td className="px-4 py-2 border">{srm.telph}</td>
                <td className="px-4 py-2 border">{srm.managerId ? srm.managerId: 'No Manager Assigned'}</td>
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
            initialData={selectedSRM || { nom: '', code: '', adresse: '', email: '', telph: '', status: 'inactive', managerId:'' }}
            isEdit={isEditMode}
            users={managers}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
