import emailjs from '@emailjs/browser';

// EmailJS configuration from environment variables
// EmailJS configuration
const emailServiceId = 'service_alioa7n';
const emailTemplateId = 'template_30mffms';
const emailPublicKey = 'g62j2cmhqy4-WTNOD';


// Check if we're in browser environment before initializing
const isBrowser = typeof window !== 'undefined';

// Initialize EmailJS if we're in a browser environment
if (isBrowser) {
  try {
    emailjs.init(emailPublicKey);
    console.log('EmailJS initialized in browser environment');
  } catch (err) {
    console.log('EmailJS initialization issue:', err.message);
  }
}

/**
 * Send provider credentials via email
 * @param {Object} provider - The provider data
 * @param {string} password - Generated password
 * @returns {Promise} - Email sending result
 */
export const sendProviderCredentials = async (provider, password) => {
  console.log('Starting email sending process with EmailJS...');
  
  // Validate environment and credentials
  if (!isBrowser) {
    console.error('EmailJS can only be used in browser environment');
    return false;
  }
  
  // Directly access provider data for debugging
  const providerUser = provider.username || '';
  
  console.log('Provider data received:', { 
    id: provider.id,
    name: provider.name,
    email: provider.email,
    username: providerUser 
  });
  
  // Simple direct parameters for EmailJS
  const templateParams = {
    to_email: provider.email || '',
    to_name: provider.name || '',
    username: providerUser, // Use the cached variable
    password: password || '',
    login_url: 'http://localhost:3000/provider-login'
  };
  
  console.log('EmailJS parameters being sent:', {
    to_email: templateParams.to_email,
    to_name: templateParams.to_name,
    username: templateParams.username,
    password: templateParams.password
  });
  
  try {
    // Send email directly with the simple parameters
    const response = await emailjs.send(
      emailServiceId,
      emailTemplateId,
      templateParams
    );
    
    console.log('Email sent successfully!');
    return true;
  } catch (error) {
    console.error('Failed to send credentials email:', error.message);
    return false;
  }
};

export default {
  sendProviderCredentials
}; 