import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { resetPasswordSchema } from "../../utils/validations/customerValidations/reset-passwordvalidator";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useToast } from "../../hooks/ui/useToast";
import { ResetPasswordFormValues, ResetPasswordFormData } from "../../types/auth";
import { useResetPassword } from "../../hooks/customer/useCustomerAuth";

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<ResetPasswordFormData | null>(null)
    const resetPassword = useResetPassword()

    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const handleSubmit = async (values: ResetPasswordFormValues) => {
        try {
            setIsLoading(true);
            const resetPasswordData: ResetPasswordFormData = {
                password: values.password,
                confirmPassword: values.confirmPassword,
                token: token ?? ""
            }

            setFormData(resetPasswordData);

            if (!formData) {
                toast({
                    title: "Error",
                    description: "Missing registration data. Please try again.",
                    variant: "destructive",
                });
                return;
            }

            await resetPassword.mutateAsync(formData)

            toast({
                title: "Password Updated",
                description: "Your password has been reset successfully",
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to reset password",
                variant: "destructive",
            });
            console.error("Password reset error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    
    if (!token) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h1 className="mb-4 text-2xl font-bold">Invalid Reset Link</h1>
            <p className="mb-6 text-gray-600">
              The password reset link you used is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="block w-full rounded-md bg-black p-3 text-center font-semibold text-amber-400 hover:bg-gray-900"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      );
    }

    return (
        <div className="flex min-h-screen">
            {/* Left side with illustration - 1/2 of the page */}
            <div className="hidden md:flex md:w-1/2 bg-blend-color items-center justify-center p-8">
                <img
                    src="./mechs2.jpg"
                    alt="Auto mechanics working on a car"
                    className="object-contain w-full max-w-lg h-full"
                />
            </div>

            {/* Right side with form - 1/2 of the page */}
            <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
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
                                className="text-amber-400"
                            >
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold uppercase tracking-wider">Automate</h2>
                        <div className="mt-2">
                            <Link to="/landing" className="text-amber-600 hover:text-amber-800 text-sm">
                                View our landing page
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center mb-6">
                        <Link to="/login" className="flex items-center text-gray-600 hover:text-amber-600 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            <span>Back to login</span>
                        </Link>
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    <p className="text-gray-600 mb-8">Enter your new password below</p>

                    <Formik
                        initialValues={{
                            password: "",
                            confirmPassword: "",
                        }}
                        validationSchema={resetPasswordSchema}
                        onSubmit={handleSubmit}
                    >
                        {({  }) => (
                            <Form className="space-y-4">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="New Password"
                                        className="w-full p-3 pl-10 rounded-md border border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                                        placeholder="Confirm New Password"
                                        className="w-full p-3 pl-10 rounded-md border border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                                    disabled={isLoading}
                                    className="w-full h-12 bg-black text-amber-400 font-semibold rounded-md hover:bg-gray-900 transition-colors mt-6"
                                >
                                    {isLoading ? "Updating..." : "Reset Password"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
