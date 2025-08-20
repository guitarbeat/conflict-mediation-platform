import React, { useState, useEffect } from 'react';
import EnhancedNavigation from './EnhancedNavigation';
import EnhancedForm from './EnhancedForm';

const PremiumUXPrototype = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  // Simulate offline state
  useEffect(() => {
    const handleOnline = () => setShowOffline(false);
    const handleOffline = () => setShowOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle navigation
  const handleNavigate = (page, data = {}) => {
    setCurrentPage(page);
    // Simulate page transition
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // Sample form fields for demonstration
  const sampleFields = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      helpText: 'Enter your legal name as it appears on official documents.'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Please enter a valid email address'
      },
      helpText: 'We\'ll use this to send you important updates and confirmations.'
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      validation: {
        required: false,
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        patternMessage: 'Please enter a valid phone number'
      },
      helpText: 'Optional: For urgent communications and scheduling.'
    },
    {
      name: 'mediationType',
      type: 'select',
      label: 'Type of Mediation',
      placeholder: 'Select mediation type',
      options: [
        { value: 'workplace', label: 'Workplace Conflict' },
        { value: 'family', label: 'Family Dispute' },
        { value: 'business', label: 'Business Partnership' },
        { value: 'community', label: 'Community Issue' },
        { value: 'other', label: 'Other' }
      ],
      validation: { required: true },
      helpText: 'Select the category that best describes your situation.'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Situation Description',
      placeholder: 'Describe the conflict or situation you need help with...',
      validation: {
        required: true,
        minLength: 20,
        maxLength: 500
      },
      helpText: 'Provide a clear, objective description of the situation. Include relevant details but avoid personal attacks.'
    },
    {
      name: 'urgency',
      type: 'radio',
      label: 'Urgency Level',
      options: [
        { value: 'low', label: 'Low - Can wait a few weeks' },
        { value: 'medium', label: 'Medium - Would like to resolve soon' },
        { value: 'high', label: 'High - Needs immediate attention' }
      ],
      validation: { required: true },
      helpText: 'This helps us prioritize your case appropriately.'
    },
    {
      name: 'agreement',
      type: 'checkbox',
      label: 'I agree to the terms and conditions',
      validation: { required: true },
      helpText: 'You must agree to our terms to proceed with mediation services.'
    }
  ];

  // Render different pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="page-transition">
            <div className="text-center py-16">
              <h1 className="text-display-2xl text-primary-700 mb-6">
                Welcome to Mediation Hub
              </h1>
              <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                Professional conflict resolution services with a focus on understanding, 
                communication, and sustainable solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleNavigate('mediation-request')}
                  className="btn btn-primary btn-lg hover-lift btn-press"
                >
                  Start Mediation Request
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => handleNavigate('learn-more')}
                  className="btn btn-outline btn-lg hover-scale btn-press"
                >
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: '🤝',
                  title: 'Professional Mediators',
                  description: 'Experienced, certified mediators with expertise in various conflict types.'
                },
                {
                  icon: '🔒',
                  title: 'Confidential Process',
                  description: 'Your privacy is protected throughout the entire mediation process.'
                },
                {
                  icon: '⚡',
                  title: 'Quick Resolution',
                  description: 'Most conflicts are resolved within 2-4 sessions.'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="card hover-lift p-6 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-heading-lg mb-2">{feature.title}</h3>
                  <p className="text-body-md text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'mediation-request':
        return (
          <div className="page-transition">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-display-xl text-primary-700 mb-4">
                  Mediation Request Form
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Tell us about your situation so we can match you with the right mediator.
                </p>
              </div>

              <EnhancedForm
                fields={sampleFields}
                onSubmit={handleFormSubmit}
                autoSave={true}
              />
            </div>
          </div>
        );

      case 'learn-more':
        return (
          <div className="page-transition">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-display-xl text-primary-700 mb-8">
                About Mediation
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-body-lg mb-6">
                  Mediation is a voluntary, confidential process where a neutral third party 
                  helps disputing parties reach a mutually acceptable resolution.
                </p>
                
                <h2 className="text-heading-lg text-foreground mb-4">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                    { step: '1', title: 'Initial Consultation', description: 'We discuss your situation and determine if mediation is appropriate.' },
                    { step: '2', title: 'Mediator Selection', description: 'We match you with a mediator who has relevant experience.' },
                    { step: '3', title: 'Mediation Sessions', description: 'Structured sessions to explore issues and find solutions.' },
                    { step: '4', title: 'Agreement', description: 'Document the resolution and next steps for all parties.' }
                  ].map((item, index) => (
                    <div key={index} className="card p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="text-heading-md mb-2">{item.title}</h3>
                          <p className="text-body-md text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="page-transition">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-display-xl text-primary-700 mb-8">
                Help & Support
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-heading-lg mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {[
                      'What is the cost of mediation?',
                      'How long does the process take?',
                      'Is mediation legally binding?',
                      'What if we can\'t reach an agreement?'
                    ].map((question, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span className="text-body-md">{question}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-heading-lg mb-4">Contact Support</h3>
                  <p className="text-body-md text-muted-foreground mb-4">
                    Need immediate assistance? Our support team is here to help.
                  </p>
                  <button className="btn btn-primary btn-md w-full">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="page-transition">
            <div className="text-center py-16">
              <h1 className="text-display-xl text-primary-700 mb-4">
                Page Not Found
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8">
                The page you're looking for doesn't exist.
              </p>
              <button
                onClick={() => handleNavigate('home')}
                className="btn btn-primary btn-md"
              >
                Go Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Navigation */}
      <EnhancedNavigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        showSearch={true}
        showHelp={true}
      />

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Offline Indicator */}
        {showOffline && (
          <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-warning-800">
                You're currently offline. Some features may be limited.
              </span>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="spinner spinner-lg mb-4"></div>
              <p className="text-body-md text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50">
            <div className="card bg-success-50 border-success-200 p-4 max-w-sm celebration">
              <div className="flex items-center space-x-3">
                <div className="success-check">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-heading-md text-success-800">Success!</h4>
                  <p className="text-body-sm text-success-700">
                    Your mediation request has been submitted successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-heading-md mb-4">Mediation Hub</h3>
              <p className="text-body-sm text-muted-foreground">
                Professional conflict resolution services for individuals and organizations.
              </p>
            </div>
            <div>
              <h4 className="text-heading-sm mb-4">Services</h4>
              <ul className="space-y-2 text-body-sm text-muted-foreground">
                <li>Workplace Mediation</li>
                <li>Family Dispute Resolution</li>
                <li>Business Partnership Issues</li>
                <li>Community Conflicts</li>
              </ul>
            </div>
            <div>
              <h4 className="text-heading-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-body-sm text-muted-foreground">
                <li>Mediation Guide</li>
                <li>Conflict Resolution Tips</li>
                <li>FAQ</li>
                <li>Contact Information</li>
              </ul>
            </div>
            <div>
              <h4 className="text-heading-sm mb-4">Contact</h4>
              <p className="text-body-sm text-muted-foreground">
                Get in touch for professional mediation services.
              </p>
              <button className="btn btn-primary btn-sm mt-3">
                Contact Us
              </button>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-body-sm text-muted-foreground">
            <p>&copy; 2024 Mediation Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumUXPrototype;