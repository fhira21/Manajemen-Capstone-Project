import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/authLayouts';
import Button from '../components/buttonPrimary';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import usersData from '../data/user.json'; // Make sure this path is correct

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Find user by email or username
    const user = usersData.USER.find(
      (u) => u.Email === email || u.Username === email
    );

    if (!user) {
      setError('Email/username tidak ditemukan');
      return;
    }

    if (user.Password !== password) {
      setError('Password salah');
      return;
    }

    // Login user
    login({
      id: user.ID_User,
      name: user.Username,
      email: user.Email,
      role: user.Role
    });

    // Check if there's a saved redirect path
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      navigate(redirectPath);
    } else {
      // Default redirects based on role
      switch (user.Role) {
        case 'Mahasiswa':
          navigate('/student/dashboard');
          break;
        case 'Dosen':
          navigate('/lecturer/dashboard');
          break;
        case 'Mitra':
          navigate('/partner/dashboard');
          break;
        default:
          setError('Role tidak valid');
      }
    }
  };

  const inputClasses = 'w-full rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-secondary';

  return (
    <AuthLayout>
      <PageTitle
        title="Login"
        description="Login to your account to access the management system."
      />
      <div className="bg-primary w-full h-[600px] flex flex-col items-center justify-evenly rounded-2xl">
        <h1 className='text-white font-bold text-4xl'>Masuk</h1>
        <form onSubmit={handleLogin} className='w-[90%] flex flex-col items-center justify-center gap-4'>
          {error && (
            <div className="w-full p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <p className='text-white'>Email/Username</p>
            <input 
              className={inputClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <p className='text-white'>Password</p>
            <div className="relative w-full">
              <input 
                className={inputClasses} 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                <img 
                  src={showPassword 
                    ? "/assets/icons/icons8-hide-90.png" 
                    : "/assets/icons/icons8-show-90.png"} 
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>
          <Link to="/forgot-password" className='w-full text-right text-white text-sm'>Lupa Password?</Link>
          <Button className='w-full' label='Masuk' type="submit" />
          <Link to="/register" className='w-full text-center text-white text-sm'>Belum mempunyai akun? Buat akun sekarang</Link>
        </form>
      </div>
    </AuthLayout>
  );
}