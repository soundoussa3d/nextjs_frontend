
// src/app/login/page.tsx
"use client"; // Marking this component as a client component

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();


  const handleLogin = async  (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log("data",data);
      const token = data.access_token
      console.log(token);
      // You can save the token (if any) to localStorage or cookies
      if (token) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', data.user.type);
        localStorage.setItem('userid', data.user._id);  // Only store if token exists
      } else {
        console.error('Token is undefined');
      }
    
      console.log(data.role)

      if (data.user.type == 'super-admin') {
        router.push('/dashboard'); 
      } 
      else if (data.user.type == 'admin') {
        router.push('/regions'); 
      }
      else if (data.user.type == 'manager') {
        router.push('/myregions'); 
      }
      else if (data.user.type == 'agent') {
        router.push('/forms'); 
      }
     // router.push('/dashboard1'); // Redirect to a dashboard page or home page on successful login
    } catch (err) {
      setError('Invalid email or password');
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none"
          >
            Login
          </button>
        </form>
        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
