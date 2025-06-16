import React from 'react';

export default function AuthLayout({children, title}) {
  return (
      <div className="bg-primary sm:bg-white grid grid-cols-6 sm:grid-cols-12 min-h-screen pt-2 pb-2 pl-10  pr-10">
          <div className="col-span-6  hidden sm:flex  items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl tracking-wider font-bold mb-2">Application</h1>
              <h1 className="text-4xl tracking-wider font-semibold">Management Capstone</h1>
            </div>
          </div>
          
          {/* Right side - Auth form */}
        <div className="col-span-6 flex items-center justify-center ">
          <div className=" w-full ">
            {children}
          </div>
        </div>
      </div>
  );
}