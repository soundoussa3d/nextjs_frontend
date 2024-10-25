import React, { useEffect, useState } from 'react';

interface Region {
  _id: string;
  nom: string;
}

interface RegionSelectorProps {
    onRegionsChange: (regions: Region[]) => void; // New prop for handling region changes
  }
const RegionSelector: React.FC<RegionSelectorProps> = ({ onRegionsChange })  => {
  const [availableRegions, setAvailableRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>(''); // To track the selected region

  // Fetch regions from your backend
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('http://localhost:3000/regions'); // Replace with your API
        const data = await response.json();
        setAvailableRegions(data); // Set the list of regions
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchRegions();
  }, []);

  // Handle region selection from the dropdown
  const handleSelectRegion = (regionId: string) => {
    const selectedRegion = availableRegions.find((r) => r._id === regionId);
    if (selectedRegion) {
      setSelectedRegions([...selectedRegions, selectedRegion]); // Add region to selected list
      setAvailableRegions(availableRegions.filter((r) => r._id !== regionId)); // Remove region from available list
      setSelectedRegionId(''); // Reset dropdown
      onRegionsChange([...selectedRegions, selectedRegion]);
    }
  };

  // Handle removal of a region from the selected list (optional)
  const handleRemoveRegion = (region: Region) => {
    setSelectedRegions(selectedRegions.filter((r) => r._id !== region._id)); // Remove from selected list
    setAvailableRegions([...availableRegions, region]); // Add back to available list
    onRegionsChange(selectedRegions.filter((r) => r._id !== region._id));4
  };

  return (
    <div>
      <h1>Select Regions</h1>

      {/* Dropdown for Available Regions */}
      <div>
        <h2>Available Regions</h2>
        <select
          value={selectedRegionId}
          onChange={(e) => {
            handleSelectRegion(e.target.value);
            setSelectedRegionId(e.target.value); // Update the selected region ID
          }}
          className="border p-2 rounded w-full"
        >
          <option value="" disabled>
            Select a region
          </option>
          {availableRegions.map((region) => (
            <option key={region._id} value={region._id}>
              {region.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Regions */}
      <div className="mt-4">
        <h2>Selected Regions</h2>
        <ul>
          {selectedRegions.length > 0 ? (
            selectedRegions.map((region) => (
              <li key={region._id} className="flex justify-between">
                {region.nom}
                <button
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveRegion(region)} // Optionally allow unselecting
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p>No regions selected</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RegionSelector;
