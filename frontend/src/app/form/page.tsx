"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";


interface Form {
    _id: string;
    nameOfValue: string;
    unit: string;
    
    // Add other relevant fields for the SRMs
  }
const AgentFormsPage = ({ params }: { params: { agentId: string } }) => {
  const { agentId } = params; // Extract agentId from params
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`http://localhost:3000/form`);
        if (!response.ok) throw new Error("Failed to fetch forms");
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [agentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Layout>
    <div>
      <h1>Forms Created by Agent</h1>
      <table className="min-w-full mt-4 border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Name of Value</th>
            <th className="px-4 py-2 border">Unit</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form._id} className="border-b">
              <td className="px-4 py-2 border">{form.nameOfValue}</td>
              <td className="px-4 py-2 border">{form.unit}</td>
              <td className="px-4 py-2 border">
                <a
                  href={`/form/${form._id}`} // Assuming a chart page for each form
                  className="text-blue-600 hover:underline"
                >
                  View Chart
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </Layout>
  );
};

export default AgentFormsPage;
