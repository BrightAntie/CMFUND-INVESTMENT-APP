import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Phone, 
  Flag, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Target,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  SkipForward
} from 'lucide-react';

interface OnboardingProps {
  onNavigate: (page: string) => void;
}

interface FormData {
  // Section 1: Personal Information
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  nationality: string;
  
  // Section 2: KYC & Verification (Display only)
  idVerification: 'verified' | 'pending' | 'failed';
  addressVerification: 'verified' | 'pending' | 'failed';
  amlCheck: 'verified' | 'pending' | 'failed';
  pepScreening: 'verified' | 'pending' | 'failed';
  
  // Section 3: Investment Preferences
  riskAppetite: string;
  investmentGrowth: string;
  timeHorizon: string;
  preferredAssets: string;
  monthlyInvestmentCapital: string;
}

const Onboarding: React.FC<OnboardingProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    nationality: 'Ghana',
    idVerification: 'verified',
    addressVerification: 'pending',
    amlCheck: 'verified',
    pepScreening: 'verified',
    riskAppetite: '',
    investmentGrowth: '',
    timeHorizon: '',
    preferredAssets: '',
    monthlyInvestmentCapital: ''
  });

  const countries = [
    'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 
    'Tunisia', 'Algeria', 'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda',
    'Botswana', 'Namibia', 'Zambia', 'Zimbabwe', 'Malawi', 'Mozambique',
    'Angola', 'Cameroon', 'Senegal', 'Ivory Coast', 'Burkina Faso', 'Mali',
    'Niger', 'Chad', 'Sudan', 'Libya', 'Tunisia', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.nationality) newErrors.nationality = 'Nationality is required';
      
      // Phone number validation
      if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
      
      // Date validation
      if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          newErrors.dateOfBirth = 'You must be at least 18 years old';
        }
      }
    }
    
    if (step === 3) {
      if (!formData.riskAppetite) newErrors.riskAppetite = 'Risk appetite is required';
      if (!formData.investmentGrowth) newErrors.investmentGrowth = 'Investment growth preference is required';
      if (!formData.timeHorizon) newErrors.timeHorizon = 'Time horizon is required';
      if (!formData.preferredAssets) newErrors.preferredAssets = 'Preferred assets is required';
      if (!formData.monthlyInvestmentCapital) newErrors.monthlyInvestmentCapital = 'Monthly investment capital is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleComplete = async () => {
    if (validateStep(3)) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      onNavigate('dashboard');
    }
  };

  const handleSkip = () => {
    onNavigate('dashboard');
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Not Started';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-500';
      case 'pending':
        return 'text-orange-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const steps = [
    { number: 1, title: 'Personal Information', icon: User, required: true },
    { number: 2, title: 'KYC & Verification', icon: CheckCircle, required: false },
    { number: 3, title: 'Investment Preferences', icon: Target, required: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-white font-bold text-2xl">CM</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help us personalize your investment experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    currentStep >= step.number
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number
                      ? 'text-orange-500'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Step {step.number}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step.number
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-8 transition-colors duration-300 ${
                    currentStep > step.number
                      ? 'bg-orange-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            {/* Section 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3 text-orange-500" />
                  Personal Information
                </h2>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nationality *
                  </label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                        errors.nationality ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  {errors.nationality && (
                    <p className="mt-1 text-sm text-red-500">{errors.nationality}</p>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: KYC & Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-orange-500" />
                  KYC & Verification
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your verification status is automatically updated based on our compliance checks.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID Verification */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">ID Verification</h3>
                      {getVerificationIcon(formData.idVerification)}
                    </div>
                    <p className={`text-sm font-medium ${getVerificationColor(formData.idVerification)}`}>
                      {getVerificationText(formData.idVerification)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Government-issued ID document
                    </p>
                  </div>

                  {/* Address Verification */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Address Verification</h3>
                      {getVerificationIcon(formData.addressVerification)}
                    </div>
                    <p className={`text-sm font-medium ${getVerificationColor(formData.addressVerification)}`}>
                      {getVerificationText(formData.addressVerification)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Proof of residence document
                    </p>
                  </div>

                  {/* AML Check */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">AML Check</h3>
                      {getVerificationIcon(formData.amlCheck)}
                    </div>
                    <p className={`text-sm font-medium ${getVerificationColor(formData.amlCheck)}`}>
                      {getVerificationText(formData.amlCheck)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Anti-Money Laundering screening
                    </p>
                  </div>

                  {/* PEP Screening */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">PEP Screening</h3>
                      {getVerificationIcon(formData.pepScreening)}
                    </div>
                    <p className={`text-sm font-medium ${getVerificationColor(formData.pepScreening)}`}>
                      {getVerificationText(formData.pepScreening)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Politically Exposed Person check
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Investment Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-orange-500" />
                  Investment Preferences
                </h2>
                
                {/* Risk Appetite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Risk Appetite *
                  </label>
                  <select
                    name="riskAppetite"
                    value={formData.riskAppetite}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                      errors.riskAppetite ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select your risk appetite</option>
                    <option value="aggressive">Aggressive - High risk, high potential returns</option>
                    <option value="moderate">Moderate - Balanced risk and return</option>
                    <option value="low">Low - Conservative approach with steady returns</option>
                  </select>
                  {errors.riskAppetite && (
                    <p className="mt-1 text-sm text-red-500">{errors.riskAppetite}</p>
                  )}
                </div>

                {/* Investment Growth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investment Growth Preference *
                  </label>
                  <select
                    name="investmentGrowth"
                    value={formData.investmentGrowth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                      errors.investmentGrowth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select your growth preference</option>
                    <option value="short-term">Short-term growth - Quick returns (1-2 years)</option>
                    <option value="long-term">Long-term growth - Steady appreciation (5+ years)</option>
                  </select>
                  {errors.investmentGrowth && (
                    <p className="mt-1 text-sm text-red-500">{errors.investmentGrowth}</p>
                  )}
                </div>

                {/* Time Horizon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Horizon *
                  </label>
                  <select
                    name="timeHorizon"
                    value={formData.timeHorizon}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                      errors.timeHorizon ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select your time horizon</option>
                    <option value="1-year">1 year</option>
                    <option value="2-years">2 years</option>
                    <option value="5-years">5 years</option>
                    <option value="10-years">10 years</option>
                  </select>
                  {errors.timeHorizon && (
                    <p className="mt-1 text-sm text-red-500">{errors.timeHorizon}</p>
                  )}
                </div>

                {/* Preferred Assets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Assets *
                  </label>
                  <select
                    name="preferredAssets"
                    value={formData.preferredAssets}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                      errors.preferredAssets ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select your preferred assets</option>
                    <option value="cash-crops">Cash crops - Agricultural investments</option>
                    <option value="bonds">Bonds - Fixed income securities</option>
                    <option value="stocks">Stocks - Equity investments</option>
                    <option value="real-estate">Real Estate - Property investments</option>
                    <option value="mixed-portfolio">Mixed Portfolio - Diversified approach</option>
                  </select>
                  {errors.preferredAssets && (
                    <p className="mt-1 text-sm text-red-500">{errors.preferredAssets}</p>
                  )}
                </div>

                {/* Monthly Investment Capital */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Investment Capital *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="monthlyInvestmentCapital"
                      value={formData.monthlyInvestmentCapital}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ${
                        errors.monthlyInvestmentCapital ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select your monthly investment capacity</option>
                      <option value="1000">GH₵1,000</option>
                      <option value="2000-3000">GH₵2,000 - GH₵3,000</option>
                      <option value="5000-10000">GH₵5,000 - GH₵10,000</option>
                      <option value="10000+">GH₵10,000+</option>
                    </select>
                  </div>
                  {errors.monthlyInvestmentCapital && (
                    <p className="mt-1 text-sm text-red-500">{errors.monthlyInvestmentCapital}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div className="flex space-x-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                
                {currentStep === 2 && (
                  <button
                    onClick={handleSkip}
                    className="flex items-center px-6 py-3 text-orange-500 hover:text-orange-600 transition-colors duration-300"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip for now
                  </button>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={currentStep === 3 ? handleComplete : handleNext}
                disabled={isLoading}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <>
                    {currentStep === 3 ? 'Complete Profile' : 'Next'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;