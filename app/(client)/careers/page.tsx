'use client';

import Container from "@/components/Container";
import { useState } from "react";

const CareersPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/career-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you for your interest! We\'ll keep you updated with our latest career opportunities.');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setMessageType('error');
      }
    } catch {
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="bg-white  py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Careers at Nirvanah Farms Ltd.
          </h1>
        </div>

        {/* Content */}
        <div className="text-left mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            We&rsquo;re always looking for great talent, but at this time, we have no open roles.
            If you&rsquo;d like to be notified when new opportunities become available, please drop your email below. 
            We&rsquo;ll keep you updated with our latest career news.
          </p>
        </div>

        {/* Email Form */}
        <div className="max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full hover:bg-green-900 bg-shop_light_green disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Submitting...' : 'Notify Me'}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default CareersPage; 