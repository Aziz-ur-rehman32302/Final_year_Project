import { API_BASE_URL } from '../../config';
import React, { useState } from 'react'

import AdminSidebar from './AdminSidebar'
import { getToken } from '../../utils/auth'
import { UserPlus,CheckCircle } from 'lucide-react';

const TenantRegistration = () => {

  


  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
      username: '',
      password: '',
      role: 'tenant',
      cnic: '',
      phone: '',
      email: '',
      shop_number: '',
      floor: '',
      rent_amount: '',
      rent_due_date: '',
      start_date: '',
      end_date: '',
    });

     const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setErrorMessage('Username is required');
      return;
    }
    
    const token = getToken();
    if (!token) {
      setErrorMessage('No token found. Please login again.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(API_BASE_URL + '/add_tenant.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('Empty response from server');
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse:', err);
        throw new Error('Invalid response from server');
      }

      if (result.status === 'success') {
        // Clear form immediately
        setFormData({
          username: '',
          password: '',
          role: 'tenant',
          cnic: '',
          phone: '',
          email: '',
          shop_number: '',
          floor: '',
          rent_amount: '',
          rent_due_date: '',
          start_date: '',
          end_date: '',
        });
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 4000);
      } else {
        setErrorMessage(result.message || 'Failed to add tenant');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

 const shopNumbers = ['S-101', 'S-102', 'S-103', 'S-201', 'S-202', 'S-203', 'S-301', 'S-302', 'S-303'];
  const floors = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];
  const dueDates = Array.from({ length: 28 }, (_, i) => i + 1);





  return (
    <div className='flex flex-col items-center p-6'>
      <div className="mb-6 items-start w-[90%]">
                <div className="flex justify-start items-start gap-2 mb-1">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                  <h1 className="text-gray-900 pt-1 font-semibold">Add New Tenant</h1>
                </div>
                <p className="text-gray-600">Register a new tenant and assign shop details.</p>
      </div>
      <div className='border border-gray-300 shadow-lg p-5 w-[90%] rounded-lg'>
        
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50 transform transition-all duration-500 ease-in-out animate-slide-in">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm opacity-90">Tenant added successfully</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Registration Form */}
        <form onSubmit={(e)=>{
          
          handleSubmit(e)
        }} className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Personal Details */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Set a password"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="tenant">Tenant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="cnic" className="block text-gray-700 mb-2">
                  CNIC *
                </label>
                <input
                  id="cnic"
                  name="cnic"
                  type="text"
                  value={formData.cnic}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="00000-0000000-0"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="+92 300 0000000"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shop Details */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Shop Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="shopNumber" className="block text-gray-700 mb-2">
                  Shop Number *
                </label>
                <select
                  id="shopNumber"
                  name="shop_number"
                  value={formData.shop_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select shop number</option>
                  {shopNumbers.map((shop) => (
                    <option key={shop} value={shop}>
                      {shop}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="floor" className="block text-gray-700 mb-2">
                  Floor *
                </label>
                <select
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select floor</option>
                  {floors.map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rent/Agreement Details */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Rent & Agreement Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rentAmount" className="block text-gray-700 mb-2">
                  Monthly Rent Amount *
                </label>
                <input
                  id="rentAmount"
                  name="rent_amount"
                  type="number"
                  value={formData.rent_amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="2500"
                  required
                />
              </div>

              <div>
                <label htmlFor="rentDueDate" className="block text-gray-700 mb-2">
                  Rent Due Date (Day of Month) *
                </label>
                <select
                  id="rentDueDate"
                  name="rent_due_date"
                  value={formData.rent_due_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select due date</option>
                  {dueDates.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-gray-700 mb-2">
                  Agreement Start Date *
                </label>
                <input
                  id="startDate"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-gray-700 mb-2">
                  Agreement End Date *
                </label>
                <input
                  id="endDate"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Add Tenant'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  onNavigate('admin-dashboard');
                } catch(e) {
                  window.location.reload();
                }
              }}
              className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      
      
      
    </div>
    </div>
  )
}

export default TenantRegistration
