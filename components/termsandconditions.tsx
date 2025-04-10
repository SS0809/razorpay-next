
export default function TermsPage() {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions – BleanFitness Gym Trainer Service</h1>
        
        <p className="mb-4">
          At BleanFitness, we strive to deliver elite service and foster a strong community of fitness enthusiasts. 
          We believe in full transparency, which is why we make all our policies available to you directly on our platform.
        </p>
  
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Trainer Booking:</strong> Clients can book trainers through our platform. Each session must be 
            scheduled in advance and is subject to trainer availability.
          </li>
  
          <li>
            <strong>Session Cancellations:</strong> Clients must cancel or reschedule their sessions at least 12 hours 
            in advance. Failure to do so may result in the session being counted as completed.
          </li>
  
          <li>
            <strong>Trainer Responsibility:</strong> Our trainers are certified and expected to provide professional, 
            safe, and effective workout sessions. Any misconduct should be reported immediately to our support team.
          </li>
  
          <li>
            <strong>Client Responsibility:</strong> Clients are expected to follow instructions during sessions and inform 
            trainers of any existing medical conditions or injuries.
          </li>
  
          <li>
            <strong>Modifications to Terms:</strong> We reserve the right to modify these Terms at any time. Continued use 
            of our service after changes implies acceptance of the revised terms.
          </li>
  
          <li>
            <strong>Jurisdiction Notice:</strong> Accessing our platform from outside permitted jurisdictions is at your 
            own risk. You are solely responsible for compliance with local laws.
          </li>
        </ul>
      </div>
    );
  };