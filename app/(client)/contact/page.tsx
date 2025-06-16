'use client';

import Container from "@/components/Container";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/contact-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you for your message! We\'ll get back to you as soon as possible.');
        setMessageType('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
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
    <Container className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info Section */}
          <div className="lg:w-1/2">
            <div className="bg-gray-50 p-8 rounded-lg h-full">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We&rsquo;re here to help! Whether you have questions about our Mangoes, need 
                help with your order, or just want to share your thoughts, don&rsquo;t hesitate to get in 
                touch.
              </p>
              
              <p className="text-base text-gray-600 mb-8">
                You can also fill out the form, and we&rsquo;ll get back to you as soon as possible.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-shop_dark_green mt-1 text-lg" />
                  <div>
                    <p className="text-gray-800 font-medium">Address</p>
                    <p className="text-gray-600">Main Road,Sapahar, Naogaon, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faPhone} className="text-shop_dark_green mt-1 text-lg" />
                  <div>
                    <p className="text-gray-800 font-medium">For Order Inquiries</p>
                    <p className="text-gray-600">+20 100 080 1735 (WhatsApp Only)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faPhone} className="text-shop_dark_green mt-1 text-lg" />
                  <div>
                    <p className="text-gray-800 font-medium">For General Inquiries</p>
                    <p className="text-gray-600">+20 2 37497624</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faEnvelope} className="text-shop_dark_green mt-1 text-lg" />
                  <div>
                    <p className="text-gray-800 font-medium">Email</p>
                    <p className="text-gray-600">nirvanah55@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faClock} className="text-shop_dark_green mt-1 text-lg" />
                  <div>
                    <p className="text-gray-800 font-medium">Business Hours</p>
                    <p className="text-gray-600">9 AM – 9 PM, Saturday through Thursday (Bangladesh Local Time)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Form Section */}
          <div className="lg:w-1/2">
            <div className="bg-white border border-gray-200 p-8 rounded-lg h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Leave Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (required)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shop_dark_green focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email (required)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shop_dark_green focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shop_dark_green focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message (required)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shop_dark_green focus:border-transparent outline-none transition-all duration-200 resize-vertical"
                    placeholder="Tell us how we can help you..."
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:ring-offset-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </form>

              {/* Message Display */}
              {message && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
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
        </div>
      </div>
    </Container>
  );
};

export default ContactPage; 