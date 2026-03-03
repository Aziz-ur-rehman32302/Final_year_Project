import React, { useState, useEffect } from 'react'
import Logo from "../../assets/Images/plaza-logo-b.png";
import { Lock, User, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/auth';


const AdminLogin = () => {
    const [username, setuserName] = useState('')
    const [userpassword, setuserPassword] = useState('')
    // State to toggle show/hide password
    const [showpassword, setshowPassword] = useState(false)

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const togglePassword =()=>{
        setshowPassword(!showpassword)
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('/api/plaza_management_system_backend/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: userpassword }),
            });
            const result = await response.json();
            if (result.status === 'success') {
                // persist using helper
                loginUser(result.user, result.token);

                if (result.user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (result.user.role === 'tenant') {
                    navigate('/tenant-dashboard');
                } else {
                    setError('Unrecognized user role');
                }
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error', err);
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate()
    // if already logged in redirect according to role
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (user.role === 'tenant') {
                navigate('/tenant-dashboard');
            }
        }
    }, [navigate]);

    // Navigate to Tenant Login page on button click
    const handleLoginAsTenant = () =>{
        navigate('/tenant-login')  // Redirect to Tenant Login page
    
    }


    return (
        
        
        <div className='min-h-screen w-full flex items-center justify-center bg-white text-black'>
      
        <div className="w-full max-w-md py-2">
         {/* Logo/Header */}
         <div className='text-center '>
          
          <div className=' flex items-center flex-col'>
            <img src={Logo} alt="Plaza Management System"  className="w-40 h-25 mb-2 text-white"/>
          </div>
          {/* Login Card Start */}
          <div className="bg-white rounded-lg shadow-2xl  py-4 px-8">
            <h2 className="text-gray-900 mb-6 font-semibold text-center">Admin Login</h2>

            <form  onSubmit={handleLogin}>

                <div>
                    <label htmlFor="username" className="block text-start text-gray-700 pl-1 mb-2">Username</label>
                    <div className="relative">
                        {/* <User/> */}
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                        onChange={ (e)=>{
                            
                            setuserName(e.target.value)
                            
                        } }
                        value={username}
                        id="username"
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter your username"
                        required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700 mb-2 pl-1 text-start"> Password</label>
                    <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                        onChange={(e)=>{
                            setuserPassword(e.target.value)}}
                        value={userpassword}
                        id="password"
                         type={showpassword ?'text':'password'} // Toggle between 'text' and 'password'
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all input"
                        placeholder="Enter your password"
                        required
                        />
                        
                    </div>

                        <div className='flex justify-items-start gap-1  items-center mt-1 pl-1'>
                            {/* // Toggle password visibility */}
                            <input  type="checkbox"  onClick={togglePassword} className='w-4 h-4 border-none rounded-md bg-blue-500 cursor-pointer' /><span className='text-sm text-blue-500'>Show Password</span>

                        </div>

                </div>
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-4 bg-blue-600 active:scale-95 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Logging in...' : 'Login'}
               </button>
                
            </form>
            
            <div className="mt-6 text-center">
                 {/* Button to navigate to Tenant Login page */}
                <button onClick={()=>{handleLoginAsTenant()}}
                className="text-blue-500 active:scale-95 cursor-pointer hover:text-blue-800 transition-colors"
                >Login as Tenant</button>
            </div>
            <div className="mt-4 text-center text-gray-500 text-sm">
            Demo credentials: admin / admin123
          </div>

          </div>
          {/* Login Card End */}
         </div>

        </div>

    </div>
  )
}

export default AdminLogin
