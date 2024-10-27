"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FormDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [formulaire, setFormulaire] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"date" | "temps" | null>(null);
  const [tempsValues, setTempsValues] = useState<string[]>([]);
  const [tempsValues1, setTempsValues1] = useState<string[]>([]);
  const [datePeriod, setDatePeriod] = useState({ start: "", end: "" });
  const [formData, setFormData] = useState({
    agentId:'',
    formulaireId:'',
    nameOfValue:'',
    unit:'',
    values:tempsValues1,
    periode:tempsValues,
    date:datePeriod
  });

  useEffect(() => {
    const fetchFormulaire = async () => {
      try {
        const storedData = localStorage.getItem('userid');
        setUser(storedData);
        const response = await fetch(`http://localhost:3000/formulaire/${id}`);
        if (!response.ok) throw new Error("Failed to fetch formulaire");
        const data = await response.json();
        setFormulaire(data);
        router.push('/form'); 
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchFormulaire();
  }, [id]);

  const handleAddValue = () => {
    setTempsValues([...tempsValues, ""]);
  };

  const handleRemoveValue = (index: number) => {
    setTempsValues(tempsValues.filter((_, i) => i !== index));
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...tempsValues];
    newValues[index] = value;
    setTempsValues(newValues);
  };
//!
  const handleAddValue1 = () => {
    setTempsValues1([...tempsValues1, ""]);
  };

  const handleRemoveValue1 = (index: number) => {
    setTempsValues1(tempsValues1.filter((_, i) => i !== index));
  };

  const handleValueChange1 = (index: number, value: string) => {
    const newValues = [...tempsValues1];
    newValues[index] = value;
    setTempsValues1(newValues);
  };

  const getDateList = (startDate: string, endDate: string): string[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
  
    // Loop from start to end date
    for (let dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(new Date(dt).toISOString().split("T")[0]); // Push formatted date
    }
  
    return dateArray;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      formulaireId: id,
      agentId: user, // Replace with the actual agent ID
      nameOfValue: formData.nameOfValue,
      unit: formData.unit,
      date: getDateList(datePeriod.start,datePeriod.end),
      values: tempsValues1,
      periode:tempsValues,
    };

    if (payload.date.length!==0 && payload.date.length!== payload.values.length) {
        console.log('not matching date and values ')
        console.log(payload);
    }

    if (payload.periode.length!==0 && payload.periode.length!== payload.values.length) {
        console.log('not matching periode and values ')
        console.log(payload);
    }

    if ( payload.periode.length== payload.values.length || payload.date.length== payload.values.length) {
        console.log(' matching  ')
        console.log(payload);

        try {
            const response = await fetch("http://localhost:3000/form", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("Failed to submit form");
            alert("Form submitted successfully!");
          } catch (err) {
            setError((err as Error).message);
          }
    }
    //console.log(payload);

    /*try {
      const response = await fetch("http://localhost:3000/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to submit form");
      alert("Form submitted successfully!");
    } catch (err) {
      setError((err as Error).message);
    }*/
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{formulaire?.name}</h1>
      <p className="mb-6">{formulaire?.description}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Values:</label>
          <select className="w-full border rounded px-3 py-2" onChange={(e) =>
            setFormData((prev) => ({
                ...prev,
            nameOfValue: e.target.value,
            }))
            }>
            {formulaire?.nameOfValues.map((value:string, idx:string) => (
              <option key={idx} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Units:</label>
          <select className="w-full border rounded px-3 py-2" onChange={(e) =>
            setFormData((prev) => ({
                ...prev,
            unit: e.target.value,
            }))
            }>
            {formulaire?.units.map((unit:string, idx:string) => (
              <option key={idx} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Temps Values:</label>
            {tempsValues1.map((value, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={value}
                  onChange={(e) => handleValueChange1(index, e.target.value)}
                  placeholder={`Value ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveValue1(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddValue1}
              className="mt-2 text-blue-500 hover:underline"
            >
              Add Value
            </button>
          </div>

        

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Period Type:</label>
          <div className="space-x-4 mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="period"
                value="date"
                onChange={() => setSelectedType("date")}
                className="mr-2"
              />
              Date
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="period"
                value="temps"
                onChange={() => setSelectedType("temps")}
                className="mr-2"
              />
              Temps
            </label>
          </div>
        </div>

        {selectedType === "date" && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Period:</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={datePeriod.start}
              onChange={(e) => setDatePeriod({ ...datePeriod, start: e.target.value })}
              placeholder="Start Date"
            />
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={datePeriod.end}
              onChange={(e) => setDatePeriod({ ...datePeriod, end: e.target.value })}
              placeholder="End Date"
            />
          </div>
        )}

        {selectedType === "temps" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Temps Values:</label>
            {tempsValues.map((value, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={`Value ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveValue(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddValue}
              className="mt-2 text-blue-500 hover:underline"
            >
              Add Value
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormDetails;
