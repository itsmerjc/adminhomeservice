'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function TestEmailPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const emailServiceId = 'service_alioa7n';
  const emailTemplateId = 'template_30mffms'; 
  const emailPublicKey = 'g62j2cmhqy4-WTNOD';
  
  // Initialize EmailJS
  emailjs.init(emailPublicKey);
  
  const sendTestEmail = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Create hardcoded test parameters
      const testParams = {
        to_email: 'test@example.com', // Change this to your actual test email
        to_name: 'Test Provider',
        username: 'testuser123',      // Hardcoded test username
        password: 'testpass456',      // Hardcoded test password
        login_url: 'http://localhost:3000/provider-login'
      };
      
      console.log('Sending test email with params:', testParams);
      
      // Send email using EmailJS
      const response = await emailjs.send(
        emailServiceId,
        emailTemplateId,
        testParams
      );
      
      console.log('Email sent successfully:', response);
      setResult({
        success: true,
        message: 'Email sent successfully!',
        details: response
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      setResult({
        success: false,
        message: 'Failed to send email: ' + error.message,
        details: error
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">EmailJS Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Parameters</h2>
        <pre className="bg-white p-3 rounded border">
          {JSON.stringify({
            to_email: 'test@example.com',
            to_name: 'Test Provider',
            username: 'testuser123',
            password: 'testpass456',
            login_url: 'http://localhost:3000/provider-login'
          }, null, 2)}
        </pre>
      </div>
      
      <button
        onClick={sendTestEmail}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>
      
      {result && (
        <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className="font-semibold">{result.message}</h3>
          <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded">
            {JSON.stringify(result.details, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">EmailJS Template Variables</h2>
        <ul className="list-disc ml-6">
          <li><code>{{to_name}}</code> - The provider's name</li>
          <li><code>{{username}}</code> - The provider's username</li>
          <li><code>{{password}}</code> - The provider's password</li>
          <li><code>{{login_url}}</code> - URL to the login page</li>
        </ul>
      </div>
    </div>
  );
} 