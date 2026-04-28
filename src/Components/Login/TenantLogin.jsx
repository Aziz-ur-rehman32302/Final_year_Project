import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react'
import Logo from "../../assets/Images/plaza-logo-b.png";
import { Lock, User, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/auth';

const TenantLogin = () => {
    const [username, setuserName] = useState('')
    const [userpassword, setuserPassword] = useState('')
    // State to toggle show/hide password
    const [showpassword, setshowPassword] = useState(false)
    // Show the forgot password form
    const [showforgotpasswordform, setshowForgotPasswordForm] = useState(false)
    // use to prevent Default Behaviour 
    const [email, setEmail] = useState('')

    const [isEmailSent, setisEmailSent] = useState(false)

    // login handler for both tenant and admin (backend will return role)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL + '/login.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password: userpassword,
                }),
            });

            const result = await response.json();
            if (result.status === 'success') {
                // persist token and user info via helper
                loginUser(result.user, result.token);

                // navigate based on role
                if (result.user.role === 'tenant') {
                    navigate('/tenant-dashboard');
                } else if (result.user.role === 'admin') {
                    navigate('/admin-dashboard');
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
     // Function to toggle password visibility
    const togglePassword =()=>{
        setshowPassword(!showpassword)
    }
    // Show the forgot password form
    const handlePasswordclick = ()=>{
        setshowForgotPasswordForm(true)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        setEmail('')
        setisEmailSent(true)
        setTimeout(() => {
            setisEmailSent(false)
            setshowForgotPasswordForm(false)
        },2000);
        
        
    }
    
    const navigate = useNavigate();

    // if already logged in redirect to proper dashboard
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === 'tenant') {
                navigate('/tenant-dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin-dashboard');
            }
        }
    }, [navigate]);

    const handleLoginasAdmin = ()=>{
        navigate('/')
    }


    return (
        
        <div className='min-h-screen w-full flex items-center justify-center relative bg-white text-black'>

            {/* Forgot Password Form Modal (Conditional Render) */}
            {showforgotpasswordform && (
              <div className=' flex justify-center items-center fixed top-0 bottom-0 left-1/952 right-0 backdrop-blur-sm backdrop-grayscale z-10 p-8'>

                <div className='p-15 bg-white flex flex-col border-1 rounded-lg shadow-xl  '>
                <h2 className='text-2xl mb-3 font-semibold '>Reset Your Password</h2>

                {isEmailSent ? 
                 (<p>A password reset link has been sent to your email.</p>):(
                    <form  onSubmit={
                        handleSubmit}
                        className='flex items-center justify-items-start flex-col ' >
                        <input onChange={(e)=>{
                            setEmail(e.target.value)
                            
                        }}
                        value={email}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all input"
                            required
                            placeholder='Enter Your Email' />
                        <button type="submit"
                        className="w-full mt-4 bg-blue-600 active:scale-95 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" >Submit</button>
                    </form>

                 )
                }

            </div >

              </div>
                
            )}
      
        <div className="w-full max-w-md py-2">
         {/* Logo/Header */}
         <div className='text-center '>
          
          <div className=' flex items-center flex-col'>
            <img src={Logo} alt="Plaza Management System"  className="w-40 h-25 mb-2 text-white"/>
          </div>
          {/* Login Card Start */}
          <div className="bg-white rounded-lg shadow-2xl py-4 px-8">
            <h2 className="text-gray-900 mb-6 text-center font-semibold ">Tanent Login</h2>

            <form onSubmit={handleLogin}>

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

                        <div className='flex justify-between items-center mt-1 pl-1'>
                            {/* // Toggle password visibility */}
                            <div className='flex justify-center items-center gap-1'>
                                <input  type="checkbox"  onClick={togglePassword} className='w-4 h-4 border-none rounded-md bg-blue-500 cursor-pointer' /><span className='text-sm '>Show Password</span>
                            </div>
                            {/* Forgot Password Button */}
                            <div>
                                <button className='text-blue-500                    cursor-pointer active:scale-95 '
                                onClick={()=>{handlePasswordclick()}}>
                                    Forget Password?
                                </button>
                            </div>

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
                <button onClick={handleLoginasAdmin}
                className="text-blue-500 active:scale-95 cursor-pointer hover:text-blue-800 transition-colors"
                >Login as Admin</button>
            </div>
            <div className="mt-4 text-center text-gray-500 text-sm">
            Demo credentials: tenant / tenant123
          </div>

          </div>
          {/* Login Card End */}

            
         </div>

        </div>

    </div>
  )
}

export default TenantLogin
