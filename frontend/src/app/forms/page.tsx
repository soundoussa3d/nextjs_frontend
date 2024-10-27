"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import ModalFormulaire from "@/components/ModalFormulaire";
import { useRouter } from "next/navigation";
 

interface Formulaire {
  _id: string;
  name: string;
  description: string;
  nameOfValues: string[];
  units: string[];
  published?: boolean;
  createdBy: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [formulaires, setFormulaires] = useState<Formulaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedFormulaire, setSelectedFormulaire] = useState<Formulaire | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [userData, setUserData] = useState<string | null>(null);


  useEffect(() => {
    const fetchFormulaires = async () => {
      try {
        const storedData = localStorage.getItem('userid');
        setUserData(storedData);
        const response = await fetch(`http://localhost:3000/formulaire?published=true`);
        if (!response.ok) throw new Error("Failed to fetch formulaires");
        const data = await response.json();
        setFormulaires(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchFormulaires();
  }, []);

  const handleAddNew = () => {
    setSelectedFormulaire(null); // Clear previous selection
    setIsEditMode(false); // Set to add mode
    setIsModalOpen(true);
  };

  const handleEdit = (formulaire: Formulaire) => {
    setSelectedFormulaire(formulaire); // Set formulaire to edit
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Formulaire): Promise<void> => {
    try {
        const d={...data,createdBy:userData,published:false}
        console.log("data :",d);
      const response = isEditMode
        ? await fetch(`http://localhost:3000/formulaire/${data._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
        : await fetch("http://localhost:3000/formulaire", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(d),
          });

      if (!response.ok) throw new Error("Failed to save formulaire");

      const savedFormulaire = await response.json();
      setFormulaires((prev) =>
        isEditMode
          ? prev.map((f) => (f._id === savedFormulaire._id ? savedFormulaire : f))
          : [...prev, savedFormulaire]
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/formulaire/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete formulaire");

      setFormulaires((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleFind = (id: string) => {
    router.push(`/forms/${id}`); // Navigate to the form details page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold"> List of forms </h1>
        

        <table className="min-w-full mt-4 border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Values</th>
              <th className="px-4 py-2 border">Units</th>
              <th className="px-4 py-2 border">Published</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formulaires.map((f) => (
              <tr key={f._id} className="border-b">
                <td className="px-4 py-2 border">{f.name}</td>
                <td className="px-4 py-2 border">{f.description}</td>
                <td className="px-4 py-2 border">{f.nameOfValues[0]}</td>
                <td className="px-4 py-2 border">{f.units[0]}</td>
                <td className="px-4 py-2 border">{f.published ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border">
                <button
                    onClick={() => handleFind(f._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Find
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <ModalFormulaire
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={
                selectedFormulaire || { 
                  name: '',
                  description: '',
                  nameOfValues: [],
                  units: [],
                  published: false,
                  createdBy:'' // Ensure consistency with the type
                } }
            isEdit={isEditMode}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
