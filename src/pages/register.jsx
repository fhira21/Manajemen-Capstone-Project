import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/authLayouts';
import { useState } from 'react';
import Button from '../components/buttonPrimary';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = 'w-full rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-secondary';

  return (
    <AuthLayout>
      <div className="bg-primary w-full h-[600px] flex flex-col items-center justify-evenly rounded-2xl">
        <h1 className='text-white font-bold text-4xl'>Register</h1>
        <form className='w-[90%] flex flex-col items-center justify-center gap-4'>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <p className='text-white'>Full Name</p>
            <input 
              className={inputClasses} 
              type="text" 
              name="fullname"
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <p className='text-white'>Email</p>
            <input 
              className={inputClasses} 
              type="email" 
              name="email"
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <p className='text-white'>Password</p>
            <div className="relative w-full">
              <input 
                className={inputClasses} 
                type={showPassword ? "text" : "password"} 
                name="password"
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
          </div>
          <Button className='w-full' label='Register' />
          <Link to="/login" className='w-full text-center text-white text-sm'>Already have an account? Login</Link>
        </form>
      </div>
    </AuthLayout>
  );
}
