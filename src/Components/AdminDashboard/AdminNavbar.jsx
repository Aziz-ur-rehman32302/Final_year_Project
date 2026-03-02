import { 
  LogOut, 
  Menu, 
  X,
  Building2 
} from 'lucide-react';

const AdminNavbar = ({toggleNavButton,isVisible}) => {
  return (
    <div className='sm:w-full border-b py-6 px-4  pb-4 flex justify-between items-center'>
      <div className='flex gap-2'>
         <button
          className="text-black pr-1 cursor-pointer lg:hidden "
          onClick={toggleNavButton}>
            {isVisible ? <X className="w-7 h-7" />:<Menu className="w-7 h-7" />}
            
        </button>
        <Building2 className="w-7.5 h-7.5 rounded-lg p-0.5 text-white bg-blue-600" />
        <h1 className=' text-xl font-medium'>Plaza Management</h1>
      </div>
      <div className='flex justify-center items-center gap-6'>
        <h2 className='text-lg sm:block hidden font-semibold'>Admin</h2>
        <button className='flex justify-center items-center gap-1 pb-1 pt-0.5 px-2 rounded bg-blue-600 outline-0 cursor-pointer active:scale-95 hover:bg-blue-700 transition-colors text-white'> <LogOut className="w-4 h-4 mt-0.5" /><span className='text-lg sm:block hidden text-center'> Logout</span></button>
      </div>
    </div>
  )
}

export default AdminNavbar
