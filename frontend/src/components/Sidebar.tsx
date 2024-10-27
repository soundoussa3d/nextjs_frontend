import Link from 'next/link';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role'); // Get the role from localStorage
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <h2 className="text-2xl font-bold text-center py-4"> Panel</h2>
      <nav className="flex flex-col space-y-2 px-4">
      {role === 'super-admin' && (
          <>
            <Link href="/dashboard" className="px-4 py-2 rounded hover:bg-gray-700">
              SRMs Table
            </Link>
            <Link href="/admins" className="px-4 py-2 rounded hover:bg-gray-700">
              Admins Table
            </Link>
          </>
        )}

        {role === 'admin' && (
          <>
            <Link href="/regions" className="px-4 py-2 rounded hover:bg-gray-700">
              Regions Table
            </Link>
            <Link href="/managers" className="px-4 py-2 rounded hover:bg-gray-700">
              Managers Table
            </Link>
          </>
        )}

        {role === 'manager' && (
          <>
          <Link href="/myregions" className="px-4 py-2 rounded hover:bg-gray-700">
              My regions 
          </Link>
          <Link href="/departements" className="px-4 py-2 rounded hover:bg-gray-700">
              Departements 
            </Link>
            <Link href="/agents" className="px-4 py-2 rounded hover:bg-gray-700">
              Agents 
            </Link>
            <Link href="/formulaires" className="px-4 py-2 rounded hover:bg-gray-700">
              Formulaires 
            </Link>
            
          </>
        )}

        {role === 'agent' && (
          <>
            <Link href="/forms" className="px-4 py-2 rounded hover:bg-gray-700">
              Forms
            </Link>
            <Link href="/form" className="px-4 py-2 rounded hover:bg-gray-700">
              Form
            </Link>
            
          </>
        )}
        
        <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-700">
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
