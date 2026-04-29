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
    const togglePassword = () => {
        setshowPassword(!showpassword)
    }
    // Show the forgot password form
    const handlePasswordclick = () => {
        setshowForgotPasswordForm(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setEmail('')
        setisEmailSent(true)
        setTimeout(() => {
            setisEmailSent(false)
            setshowForgotPasswordForm(false)
        }, 2000);


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

    const handleLoginasAdmin = () => {
        navigate('/')
    }


    return (

        <div className='min-h-screen w-full flex items-center justify-center relative bg-gray-900 text-black'>

            {/* Forgot Password Form Modal (Conditional Render) */}
            {showforgotpasswordform && (
                <div className=' flex justify-center items-center fixed top-0 bottom-0 left-1/952 right-0 backdrop-blur-sm backdrop-grayscale z-10 p-8'>

                    <div className='p-6 bg-white flex flex-col border-4 border-orange-400 rounded-3xl shadow-xl'>
                        <h2 className='text-2xl mb-4 font-bold'>Reset Your Password</h2>

                        {isEmailSent ?
                            (<p>A password reset link has been sent to your email.</p>) : (
                                <form onSubmit={
                                    handleSubmit}
                                    className='flex items-center justify-items-start flex-col w-80' >
                                    <input onChange={(e) => {
                                        setEmail(e.target.value)

                                    }}
                                        value={email}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all input text-base"
                                        required
                                        placeholder='Enter Your Email' />
                                    <button type="submit"
                                        className="w-full mt-4 bg-blue-600 active:scale-95 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer font-semibold text-base" >Submit</button>
                                </form>

                            )
                        }

                    </div >

                </div>

            )}

            <div className="w-full max-w-md py-2">
                {/* Logo/Header */}
                <div className='text-center '>

                    {/* <div className=' flex items-center flex-col'>
                        <img src={Logo} alt="Plaza Management System" className="w-40 h-25 mb-6 text-white" />
                    </div> */}
                    {/* Login Card Start */}
                    <div className="bg-white rounded-3xl shadow-2xl py-8 px-8 border-4 border-orange-400">
                        <h2 className="text-gray-900 mb-8 text-center font-bold text-2xl">Tenant Login</h2>

                        <form onSubmit={handleLogin}>

                            <div className="mb-6">
                                <label htmlFor="username" className="block text-start text-gray-700 pl-1 mb-3 font-semibold text-lg">Username</label>
                                <div className="relative">
                                    {/* <User/> */}
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        onChange={(e) => {

                                            setuserName(e.target.value)

                                        }}
                                        value={username}
                                        id="username"
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                                        placeholder="Enter your username"

                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-700 mb-3 pl-1 text-start font-semibold text-lg"> Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        onChange={(e) => {
                                            setuserPassword(e.target.value)
                                        }}
                                        value={userpassword}
                                        id="password"
                                        type={showpassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all input text-base"
                                        placeholder="Enter your password"
                                        required
                                    />

                                </div>

                                <div className='flex justify-between items-center mt-3 pl-1'>
                                    {/* // Toggle password visibility */}
                                    <div className='flex justify-center items-center gap-2'>
                                        <input type="checkbox" onClick={togglePassword} className='w-4 h-4 border-none rounded-md bg-blue-500 cursor-pointer' /><span className='text-sm font-medium text-gray-700'>Show Password</span>
                                    </div>
                                    {/* Forgot Password Button */}
                                    <div>
                                        <button className='text-blue-600 cursor-pointer active:scale-95 font-medium hover:text-blue-700'
                                            onClick={() => { handlePasswordclick() }}>
                                            Forget Password?
                                        </button>
                                    </div>

                                </div>

                            </div>
                            {error && <p className="text-red-600 text-sm mb-4 font-semibold">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-6 bg-blue-600 active:scale-95 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer font-semibold text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                        </form>

                        <div className="mt-6 text-center">
                            <button onClick={handleLoginasAdmin}
                                className="w-full border-2 border-orange-500 text-orange-500 active:scale-95 cursor-pointer hover:bg-orange-50 transition-colors py-2.5 rounded-xl font-semibold text-base"
                            >Login as Admin</button>
                        </div>


                    </div>
                    {/* Login Card End */}


                </div>

            </div>

        </div>
    )
}

export default TenantLogin
