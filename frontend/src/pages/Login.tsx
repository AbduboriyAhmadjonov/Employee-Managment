import { useState } from 'react';
import { useAuth } from '../context/authContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const {login} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        login(data.user);
      }
      console.log('Login successful:', data);
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center h-screen justify-center
      min-h-screen bg-gray-100 bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6"
    >
      <h2 className="font-pacific text-3xl text-white">Employee Managment System</h2>
      <div className="border shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 border"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="******"
              className="w-full px-3 py-2 border"
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="remember-me" className="inline-flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                name="remember-me"
                className="mr-2"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" id="forgot-password" className="text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
