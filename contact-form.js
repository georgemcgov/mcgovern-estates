// Simple contact form handler for all property pages
function setupContactForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value, 
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      property: document.querySelector('.property-title')?.textContent || 'Property Enquiry',
      timestamp: new Date().toISOString()
    };
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formSuccess.style.display = 'none';
    formError.style.display = 'none';
    
    // For now, show success message (in production, integrate with email service)
    setTimeout(() => {
      formSuccess.innerHTML = `Thank you ${formData.name}! Your enquiry about ${formData.property} has been received. We'll contact you at ${formData.email} or ${formData.phone} within 24 hours.`;
      formSuccess.style.display = 'block';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';
      
      // Log to console for development (remove in production)
      console.log('Form submission:', formData);
      
      // In production, you would send this to your backend:
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
    }, 1500);
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupContactForm);
} else {
  setupContactForm();
}