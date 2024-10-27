"use client";

import ChartComponent from "@/components/ChartComponent";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

interface Data {
    _id: number;
    nameOfValue: string;
    periode: [string];
    values: [string];
    date: [string];
    // Add other relevant fields for the SRMs
  }

  
const ChartPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [formData, setFormData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/form/${id}`);
        if (!response.ok) throw new Error("Failed to fetch form data");
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  
  

  return (
    <Layout>
    <div>
      <h1>Chart for {formData?.nameOfValue}</h1>
      <ChartComponent data={formData?.periode.length!==undefined ?{
        labels: formData?.periode || [], // Assuming periode contains the labels
        values: formData?.values.map(Number) || [], // Assuming values are numbers
      }:{
        labels: formData?.date || [], // Assuming periode contains the labels
        values: formData?.values.map(Number) || [], // Assuming values are numbers
      }} />
      {/* Here you can render your chart based on formData */}
      {/* Example: <Chart data={formData} /> */}
    </div>
    </Layout>
  );
};

export default ChartPage;
