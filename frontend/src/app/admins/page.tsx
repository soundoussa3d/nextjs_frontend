"use client"
// src/app/admins/page.tsx
import { useEffect, useState } from 'react';

interface Admin {
  id: number;
  username: string;
  email: string;
  associatedWithSRM: boolean; // Indicates if the admin is associated with an SRM
  // Add other relevant fields for the Admins
}

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:3000/users'); // Update this to your admins-fetching endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }
        const data = await response.json();
        setAdmins(data);
        console.log(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {   
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleEdit = (id: number) => {
    // Implement edit functionality here
    console.log(`Edit Admin with id: ${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/admins/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete Admin');
      }

      // Remove the Admin from the state
      setAdmins(admins.filter(admin => admin.id !== id));
      console.log(`Deleted Admin with id: ${id}`);
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
      <h1 className="text-2xl font-bold">Admin List</h1>
      <table className="min-w-full mt-4 border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
          
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Associated with SRM</th>
            <th className="px-4 py-2 border">Srms ID</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b">
              
              <td className="px-4 py-2 border">{admin.nom}</td>
              <td className="px-4 py-2 border">{admin.username}</td>
              <td className="px-4 py-2 border">
                {admin.associatedWithSRM ? 'Yes' : 'No'}
              </td>
              <td className="px-4 py-2 border">{admin.srms}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(admin.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
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

export default Admins;
