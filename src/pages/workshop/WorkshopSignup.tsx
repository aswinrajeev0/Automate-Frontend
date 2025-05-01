
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { workshopSignupSchema } from "../../utils/validations/workshopValidations/workshopSignupvalidator";
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, Building, Home, Globe } from "lucide-react";
import { WorkshopRegisterData, type WorkshopSignupFormValues } from "../../types/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/ui/useToast";
import { useSendOtp, useVerifyOtp, useWorkshopRegister } from "../../hooks/workshop/useWorkshopAuth";
import OTPModal from "../../components/modals/OtpModal";
import mechs2 from "../../assets/mechs2.jpg"

export default function WorkshopSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<WorkshopRegisterData | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const registerWorkshop = useWorkshopRegister();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const handleSubmit = async (values: WorkshopSignupFormValues) => {
    try {
      setIsLoading(true);
      setEmail(values.email);

      const registrationData: WorkshopRegisterData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.mobile,
        password: values.password,
        country: values.country,
        state: values.state,
        city: values.city,
        streetAddress: values.streetAddress,
        buildingNo: values.buildingNo
      }

      setFormData(registrationData);

      const response = await sendOtp.mutateAsync(values.email);
      if (response.status === 200) {
        setIsOTPModalOpen(true)
        toast({
          title: "Verification Code Sent",
          description: `We have sent a verification code to ${values.email}`
        })
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to send verification code. Please try again.",
          variant: "destructive"
        })
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive"
      })
      console.error("Error sending OTP:", error)
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing. Please try signing up again",
        variant: "destructive"
      })
      return;
    }

    try {
      setIsLoading(true)
      const response = await sendOtp.mutateAsync(email);
      if(response.status === 200) {
        setIsOTPModalOpen(true),
        toast({
          title: "OTP sent",
          description: "Check your email for the OTP."
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Missing registration data. Please try again",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async(otp: string) => {
    if(!formData){
      toast({
        title: "Error",
        description: "Missing regsitration data. Please try again.",
        variant: "destructive"
      })
      return;
    }

    try {
      setIsLoading(true);
      const otpResponse = await verifyOtp.mutateAsync({email, otp});

      if(otpResponse) {
        await registerWorkshop.mutateAsync(formData);
        toast({
          title: "Success",
          description: "Account created successfully"
        });
        navigate('/workshop/login')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong"
      });
      console.error(error)
    }
  }

  return (
    <div className="flex min-h-screen">
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={handleVerifyOtp}
        onResend={resendOtp}
        isLoading={isLoading}
        title="Verify Your Email"
        subtitle={`We've sent a 6-digit code to ${email}. Enter it below to verify your account.`}
      />
      {/* Left side with illustration - now 1/2 of the page */}
      <div className="hidden md:flex md:w-1/2 bg-blend-color items-center justify-center p-8">
        <img
          src={mechs2}
          alt="Auto mechanics working on a car"
          className="object-contain w-full max-w-lg h-full"
        />
      </div>

      {/* Right side with form - now 1/2 of the page */}
      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-black rounded-full p-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold uppercase tracking-wider">Automate</h2>
          </div>
          <h1 className="text-3xl font-bold mb-8">Workshop Signup</h1>

          <Formik
            initialValues={{
              name: "",
              email: "",
              mobile: "",
              password: "",
              confirmPassword: "",
              country: "",
              state: "",
              city: "",
              streetAddress: "",
              buildingNo: "",
            }}
            validationSchema={workshopSignupSchema}
            onSubmit={handleSubmit}
          >
            {({  }) => (
              <Form className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="tel"
                    name="mobile"
                    placeholder="Mobile"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Added Address Fields */}
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="text"
                    name="country"
                    placeholder="Country"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="text"
                    name="state"
                    placeholder="State"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="text"
                    name="city"
                    placeholder="City"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <Home className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="text"
                    name="streetAddress"
                    placeholder="Street Address"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="streetAddress" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type="text"
                    name="buildingNo"
                    placeholder="Building Number"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <ErrorMessage name="buildingNo" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full p-3 pl-10 rounded-md border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-black text-red-600 font-semibold rounded-md hover:bg-gray-900 transition-colors mt-6"
                >
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex justify-center items-center text-sm mt-4">
            <span>Already have an account?</span>
            <a href="/workshop/login" className="ml-2 font-semibold underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
