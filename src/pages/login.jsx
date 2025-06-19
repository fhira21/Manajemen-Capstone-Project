import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/authLayouts';
import { useState } from 'react';
import Button from '../components/buttonPrimary';
import PageTitle from '../components/PageTitle';

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = 'w-full rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-secondary';


  return (
    <AuthLayout>
      <PageTitle
        title="Login"
        description="Login to your account to access the management system."
      />
      <div className=" bg-primary w-full h-[600px] flex flex-col items-center justify-evenly rounded-2xl">
        <h1 className='text-white font-bold text-4xl'>Masuk</h1>
        <form action="" className='w-[90%] flex flex-col items-center justify-center gap-4'>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <p className='text-white'>Email</p>
            <input className={inputClasses}/>
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
          <Button className='w-full' label='Masuk' onClick={() => {}} />
          <Link to="/register" className='w-full text-center text-white text-sm'>Belum mempunyai akun? Buat akun sekarang</Link>
        </form>
      </div>
    </AuthLayout>
  );
}