'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import { sendProviderCredentials } from '../../utils/emailService';

export default function AddProviderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    businessType: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;

    const formData = new FormData();
    formData.append('file', logoFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Logo upload failed');
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  // Function to generate a secure random password
  const generateSecurePassword = () => {
    // Generate an 8-character password with letters, numbers and special characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    let providerCreated = false;
    let emailSent = false;
    let providerResult = null;
    let generatedPassword = '';

    try {
      if (!formData.email) {
        setErrorMessage('Email address is required');
        setIsSubmitting(false);
        return;
      }

      // Check if the email is valid
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setErrorMessage('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      const logoUrl = logoFile ? await uploadLogo() : null;
      
      // Generate secure password for the provider
      generatedPassword = generateSecurePassword();

      console.log('Submitting provider data...', {
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        hasPassword: !!generatedPassword,
        logoUrl: !!logoUrl
      });

      // Step 1: Create the provider
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          contact: formData.contact,
          email: formData.email,
          password: generatedPassword,
          logoUrl,
          businessType: formData.businessType
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create provider');
      }
      
      console.log('Provider created successfully:', result);
      providerCreated = true;
      providerResult = result.provider;
      
      // Log provider details to verify username
      console.log('Provider details before sending email:', {
        id: providerResult.id,
        name: providerResult.name,
        email: providerResult.email,
        username: providerResult.username,
      });
      
      // Add a direct inspection of the object literal
      console.log('RAW PROVIDER DATA BEING SENT TO EMAIL SERVICE:', JSON.stringify(providerResult, null, 2));
      
      // Step 2: Send the credentials email
      try {
        console.log('Sending provider credentials email to:', providerResult.email);
        
        if (!providerResult || !providerResult.email) {
          console.error('Provider email is missing from API response:', providerResult);
          throw new Error('Provider email is missing from API response');
        }
        
        if (!providerResult.username) {
          console.error('Provider username is missing from API response:', providerResult);
          throw new Error('Provider username is missing from API response');
        }
        
        emailSent = await sendProviderCredentials(providerResult, generatedPassword);
        console.log('Email sending result:', emailSent);
        
        if (!emailSent) {
          throw new Error('Email service failed to send the email');
        }
      } catch (emailError: any) {
        console.error('Error sending email:', emailError);
        // Continue despite email error - provider was still created
      }
      
      // Show appropriate success message
      if (emailSent) {
        setSuccessMessage(`Provider ${formData.name} was added successfully. Login credentials have been sent to ${providerResult.email}.`);
      } else {
        setSuccessMessage(`Provider ${formData.name} was added successfully but there was an issue sending the login credentials email to ${providerResult.email}. 
        
Login Details:
Username: ${providerResult.username}
Password: ${generatedPassword}`);
      }
      
      // Wait a moment for the user to see the success message
      setTimeout(() => {
        router.push('/providers');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message || 'An unknown error occurred'}`);
      console.error('Error creating provider:', error);
      
      if (providerCreated && providerResult) {
        // Provider was created but something went wrong after
        setSuccessMessage(`Provider ${formData.name} was created with ID: ${providerResult.id}
        
Login Details:        
Username: ${providerResult.username}
Password: ${generatedPassword}

Please note these credentials as the email could not be sent to ${providerResult.email}.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Add Service Provider</h1>
        
        <Navbar />
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-gray-200 text-black">Provider Information</h2>
            
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                Provider Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
                placeholder="Enter provider name"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
                placeholder="Enter provider email"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Login credentials will be sent to this email</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="contact" className="block text-sm font-medium text-black mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
                placeholder="Enter contact number"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="businessType" className="block text-sm font-medium text-black mb-1">
                Business Type
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
                required
              >
                <option value="">Select business type</option>
                <option value="Barber Shop">Barber Shop</option>
                <option value="Beauty Salon">Beauty Salon</option>
                <option value="Massage & Spa">Massage & Spa</option>
                <option value="Tattoo Shop">Tattoo Shop</option>
                <option value="Cleaning">Cleaning</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Electronic Repair">Electronic Repair</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-1">
                Provider Logo
              </label>
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {logoPreview ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={logoPreview} 
                        fill 
                        style={{ objectFit: 'contain' }} 
                        alt="Logo preview" 
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No logo</span>
                  )}
                </div>
                <div className="flex-1">
                  <label 
                    htmlFor="logo" 
                    className="cursor-pointer inline-block px-4 py-2 bg-[#2c88aa] text-white rounded-md text-sm font-medium hover:bg-[#236d89] transition-colors"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <span className="ml-3 text-sm text-gray-500">
                    {logoFile ? logoFile.name : 'No file chosen'}
                  </span>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link href="/providers">
              <button 
                type="button"
                className="px-4 py-2 bg-white text-[#1a5f7a] border border-[#1a5f7a] rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Provider'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 