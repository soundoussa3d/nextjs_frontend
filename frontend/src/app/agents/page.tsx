"use client";
// src/app/admins/page.tsx
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';  // Import Modal component
import EditForm from '../../components/EditForm';  // Import EditForm component
import ModalAgent from '@/components/ModalAgent';

interface Departement{
    _id: string;  // Use MongoDB _id for identification
    name:string; // SRM association
 }
interface Agent {
  _id?: string;  // Use MongoDB _id for identification
  username: string;
  email: string;
  nom: string;
  prenom: string;
  teleph: string;
  departementId: string ;  // SRM association
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Agent | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Fetch admins on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:3000/users?type=agent'); // Adjust your endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }
        const data = await response.json();
        setAgents(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartements = async () => {
        try {
          const response = await fetch(`http://localhost:3000/departements`); // Update this to your SRM-fetching endpoint
          if (!response.ok) throw new Error('Failed to fetch SRMs');
          const data = await response.json();
          console.log("data : ",data);
          setDepartements(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

    fetchAgents();
    fetchDepartements();
  }, []);

  // Handle adding a new admin
  const handleAddNew = () => {
    setSelectedAdmin(null); // Clear selected admin
    setIsEditMode(false);  // Set to "add" mode
    setModalOpen(true);  // Open modal
  };

  // Handle editing an existing admin
  const handleEdit = (agent: Agent) => {
    setSelectedAdmin(agent);  // Set the admin to be edited
    setIsEditMode(true);  // Set to "edit" mode
    setModalOpen(true);  // Open modal
  };

  // Close modal and reset the selected admin
  const handleCloseModal = () => {
    setModalOpen(false);  // Close modal
    setSelectedAdmin(null);  // Reset selected admin
  };

  // Save admin (both add and edit)
  const handleSave = async (agentData: Agent) => {
    try {
      const add={...agentData,type:'agent'}
      const response = isEditMode
        ? await fetch(`http://localhost:3000/users/${agentData._id}`, {
            method: 'PUT',  // For updating existing admin
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(agentData),
          })
        : await fetch('http://localhost:3000/users/agent', {
            method: 'POST',  // For adding a new admin
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(add),
          });

      if (!response.ok) {
        throw new Error('Failed to save admin');
      }

      if (isEditMode) {
        // Update the list with the modified admin
        setAgents(agents.map(agent => (agent._id === agentData._id ? agentData : agent)));
      } else {
        // Add the newly created admin to the list
        const newAdmin = await response.json();
        setAgents([...agents, newAdmin.user]);
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
        throw new Error('Failed to delete admin');
      }

      // Remove the admin from the list
      setAgents(agents.filter(agent => agent._id !== id));
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
        <h1 className="text-2xl font-bold">Agents List</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Add New Agents
        </button>
        <table className="min-w-full mt-4 border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Firstname</th>
              <th className="px-4 py-2 border">Lastname</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Telephone</th>
              <th className="px-4 py-2 border">Departement</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((admin) => {
            const dep = departements.find(mgr => mgr._id === admin.departementId); // Find the manager by ID
            return (
              <tr key={admin._id} className="border-b">
                <td className="px-4 py-2 border">{admin.prenom}</td>
                <td className="px-4 py-2 border">{admin.nom}</td>
                <td className="px-4 py-2 border">{admin.email}</td>
                <td className="px-4 py-2 border">{admin.username}</td>
                <td className="px-4 py-2 border">{admin.teleph}</td>
                <td className="px-4 py-2 border">
                {dep ? dep.name : 'No department'}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit  
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id!)}
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
      </div>
      {/* Modal for adding or editing admin */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalAgent
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
          initialData={selectedAdmin || { username: '', nom: '',prenom: '', email: '', departementId: '',teleph:'' }}
          onSave={handleSave}
          isEdit={isEditMode}
          users={departements}
        />
      </Modal>
    </Layout>
  );
};

export default Agents;
