"use client"
// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react';

interface SRM {
  id: number;
  name: string;
  status: string;
  // Add other relevant fields for the SRMs
}

const Dashboard = () => {
  const [srms, setSrms] = useState<SRM[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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

    fetchSRMs();
  }, []);

  const handleEdit = (id: number) => {
    // Implement edit functionality here
    console.log(`Edit SRM with id: ${id}`);
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
      setSrms(srms.filter(srm => srm.id !== id));
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">SRM List</h1>
      <a href="/admins" className="text-blue-600 hover:underline">Go to Admins</a>
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
          {srms.map((srm) => (
            <tr key={srm.id} className="border-b">
              <td className="px-4 py-2 border">{srm.nom}</td>
              <td className="px-4 py-2 border">{srm.code}</td>
              <td className="px-4 py-2 border">{srm.adresse}</td>
              <td className="px-4 py-2 border">{srm.email}</td>
              <td className="px-4 py-2 border">{srm.telph}</td>
              <td className="px-4 py-2 border">{srm.admin}</td>
              <td className="px-4 py-2 border">{srm.status}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(srm.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(srm.id)}
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
  );
};

export default Dashboard;
