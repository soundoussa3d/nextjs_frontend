"use client";

import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ModalSrms from '@/components/ModalSrms';
import ModalDepa from '@/components/ModalDepa';

interface Region {
  _id: string;
  nom: string;
}

interface SRM {
  _id: string;
  name: string;
  description: string;
  region: string;

}

const Dashboard = () => {
  const [srms, setSrms] = useState<SRM[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedSRM, setSelectedSRM] = useState<SRM | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [userData, setUserData] = useState<string | null>(null);


  useEffect(() => {
    const fetchSRMs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/departements`); // Update this to your SRM-fetching endpoint
        if (!response.ok) throw new Error('Failed to fetch SRMs');
        const data = await response.json();
        console.log("data : ",data);
        setSrms(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchManagers = async () => {
      try {
        const response = await fetch('http://localhost:3000/regions');
        if (!response.ok) throw new Error('Failed to fetch managers');
        const data = await response.json();
        setRegions(data);
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
    try {
        console.log(updatedData)
      const response = isEditMode
        ? await fetch(`http://localhost:3000/departements/${updatedData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
          })
        : await fetch('http://localhost:3000/departements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
          });

      if (!response.ok) throw new Error('Failed to save departement');

      if (isEditMode) {
        setSrms(srms.map(srm => (srm._id === updatedData._id ? updatedData : srm)));
      } else {
        const newSRM = await response.json();
        setSrms([...srms, newSRM]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/departements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete departements');

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
        <h1 className="text-2xl font-bold">Departements List</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Add New Departement
        </button>

        <table className="min-w-full mt-4 border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Region</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
          {srms.map((srm) => {
            const region = regions.find(mgr => mgr._id === srm.region); // Find the manager by ID
            return (
            <tr key={srm._id} className="border-b">
                <td className="px-4 py-2 border">{srm.name}</td>
                <td className="px-4 py-2 border">{srm.description}</td>
                {/* Display manager username if available */}
                <td className="px-4 py-2 border">
                {region ? region.nom : 'No region'}
                </td>
                
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
          <ModalDepa
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={selectedSRM || { name: '', description: '', region: '' }}
            isEdit={isEditMode}
            users={regions}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
