import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/authLayouts';
import { useState } from 'react';
import Button from '../components/buttonPrimary';
import PageTitle from '../components/PageTitle';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      role: ''
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username tidak boleh kosong';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf besar';
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung angka';
      isValid = false;
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role harus dipilih';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission (no actual database call)
      setTimeout(() => {
        console.log('Form data:', formData);
        setIsSubmitting(false);
        alert('Pendaftaran berhasil! Silakan login.');
        navigate('/login');
      }, 1000);
    } else {
      alert('Terdapat kesalahan dalam pengisian form. Silakan periksa kembali.');
    }
  };

  const inputClasses = (hasError) => 
    `w-full rounded h-10 p-2 focus:outline-none focus:ring-2 ${
      hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-secondary'
    }`;

  return (
    <AuthLayout>
      <PageTitle
        title="Register"
        description="Create a new account to access the management system."
      />

      <div className="bg-primary w-full h-[600px] flex flex-col items-center justify-evenly rounded-2xl">
        <h1 className='text-white font-bold text-4xl'>Daftar</h1>
        <form onSubmit={handleSubmit} className='w-[90%] flex flex-col items-center justify-center gap-4'>
          {/* Username Field */}
          <div className="w-full flex flex-col items-start justify-center gap-1">
            <p className='text-white'>Username</p>
            <input 
              className={inputClasses(errors.username)} 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="w-full flex flex-col items-start justify-center gap-1">
            <p className='text-white'>Email</p>
            <input 
              className={inputClasses(errors.email)} 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="w-full flex flex-col items-start justify-center gap-1">
            <p className='text-white'>Password</p>
            <div className="relative w-full">
              <input 
                className={inputClasses(errors.password)} 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                <img 
                  src={`/assets/icons/icons8-${showPassword ? 'hide' : 'show'}-90.png`} 
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="w-5 h-5"
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password}</p>
            )}
            <p className="text-gray-300 text-xs">
              Password harus minimal 8 karakter, mengandung huruf besar dan angka
            </p>
          </div>

          {/* Role Field */}
          <div className="w-full flex flex-col items-start justify-center gap-1">
            <label htmlFor="role" className='text-white'>Role</label>
            <select 
              id="role"
              className={inputClasses(errors.role)} 
              name="role"
              value={formData.role}
              onChange={handleChange}
              aria-label="Select role"
              required
            >
              <option value="" disabled>Pilih role</option>
              <option value="student">Mahasiswa</option>
              <option value="lecturer">Dosen</option>
              <option value="partner">Mitra</option>
            </select>
            {errors.role && (
              <p className="text-red-400 text-sm">{errors.role}</p>
            )}
          </div>

          <Button 
            className='w-full' 
            label={isSubmitting ? 'Memproses...' : 'Daftar'} 
            type="submit"
            disabled={isSubmitting}
          />
          <Link to="/login" className='w-full text-center text-white text-sm'>Sudah mempunyai akun? Login sekarang</Link>
        </form>
      </div>
    </AuthLayout>
  );
}