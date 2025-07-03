import PageTitle from "../components/PageTitle";





export default function Dashboard() {
  return (
    <>
    <PageTitle title="Dashboard "
      description={'Dashboard'} />


    <main className="h-full w-full flex flex-col gap-2 p-2">
      
      
      {/* filter render insight by list project only access for role Dosen and Mitra */}
      <div className="w-full p-2 justify-end items-center flex  ">
        <select name="" id="">
          <option value="">
            Pilih Proyek
          </option>
        </select>
      </div>

      <div className="overflow-y-auto h-full w-full grid grid-cols-12 grid-rows-2 gap-2">
          <div className="bg-red-200 col-span-12 flex">      
            
            {/* top left (statistik by progress and data proyek) */}
            <div className="p-2 w-full h-full flex justify-center items-center gap-2">
              <div className="bg-yellow-100 w-full h-full flex items-center justify-center ">
                <p className="bg-secondary w-[150px] h-[150px] flex  justify-center items-center rounded-full">bar proses</p>
              </div>
              
              <ul className="bg-purple-200 w-full h-full flex flex-col justify-start items-start gap-2">
                <li className="w-full">keterangan proyek</li>
                <li className="w-full">keterangan proyek</li>
                <li className="w-full">keterangan proyek</li>
                <li className="w-full">keterangan proyek</li>
              </ul>
            </div>

            {/* top right (task list) */}
            <div className="w-full overflow-y-auto h-full flex flex-col justify-center items-center gap-2">
              <p className="sticky">Task list</p>
              <div className="p-2 flex h-full gap-2 w-full  justify-center items-center">
                <div className="bg-gray-100 grow h-full">
                  todo
                </div>
                <div className="bg-secondary grow h-full">
                  progress
                </div>
                <div className="bg-green-300 grow h-full">
                  done
                </div>
              </div>
            </div>
            
          </div>
          
          
          
          {/* bottom left*/}
          <div className="bg-sky-400  flex justify-center items-center col-span-5 row-start-2">
            <p className="">recent activity by commit anggota kelompok</p>
          </div>


          {/* bottom right*/}
          <div className="bg-orange-400 col-span-6 flex justify-center items-center  col-start-7 row-start-2">
            <p className="">list name Leaderboard top contributor by commit in project</p>
          </div>
      </div>
    
    </main>

    </>
  );
}