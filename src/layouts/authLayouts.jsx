import Logo from "../components/Logo";

export default function AuthLayout({children, title}) {
  return (
      <div className="bg-primary sm:bg-white grid grid-cols-6 sm:grid-cols-12 min-h-screen pt-2 pb-2 pl-10  pr-10">
          <div className="col-span-6  hidden sm:flex  items-center justify-center">
            <div className="text-center flex flex-col gap-2 items-center w-[70%] justify-center">
              <h1 className="text-4xl tracking-wider font-bold mb-2">Application Management Capstone</h1>
              <Logo className="w-48 h-48 " />
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