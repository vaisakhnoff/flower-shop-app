import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import our auth instance

export default function LoginPage() {
  // We use React state to store what the user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // This hook lets us redirect the user after they log in
  const navigate = useNavigate();

  // This function runs when the form is submitted
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page from reloading
    setError(null); // Clear any old errors

    try {
      // Try to sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // If sign-in is successful, redirect to the Admin Panel
      navigate('/admin');

    } catch (err) {
      // If Firebase gives an error
      console.error("Error signing in:", err);
      setError("Failed to log in. Please check your email and password.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Admin Login
      </h2>
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
      >
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* If there's an error, we show it here */}
        {error && (
          <p className="text-sm text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        <button 
          type="submit" 
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Log In
        </button>
      </form>
    </div>
  );
}