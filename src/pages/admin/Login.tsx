
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../hooks/ui/useToast";
import { AdminLoginData } from "../../types/auth";
import { AdminLoginFormValues } from "../../types/auth";
import { adminLoginSchema } from "../../utils/validations/adminValidations/adminLoginvalidator";
import { useAdminLogin } from "../../hooks/admin/useAdminAuth";
import { useDispatch } from "react-redux";
import { adminLogin } from "../../store/slices/adminSlice";

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { toast } = useToast();
    const loginAdmin = useAdminLogin()
    const dispatch = useDispatch()

    const handleSubmit = async (values: AdminLoginFormValues) => {
        try {
            setIsLoading(true);
            const loginData: AdminLoginData = {
                email: values.email,
                password: values.password
            }

            const response = await loginAdmin.mutateAsync(loginData)
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "You have successfully logged in",
                });

                dispatch(adminLogin(response?.data))
                navigate("/admin")
            }

            console.log("Admin login submitted", values);

            toast({
                title: "Admin Access Granted",
                description: "You have successfully logged in as an administrator",
            });

            // Navigate to admin dashboard (will need to be created later)
            navigate("/admin");
        } catch (error: any) {
            toast({
                title: "Access Denied",
                description: error?.message || "Invalid admin credentials",
                variant: "destructive",
            });
            console.error("Admin login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side with illustration - 1/2 of the page */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 items-center justify-center p-8">
                <div className="text-center">
                    <div className="bg-black rounded-full p-6 mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                        <ShieldAlert className="text-purple-400 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
                    <p className="text-gray-300 max-w-md">
                        Secure access to the administrative features and controls.
                        Only authorized personnel may proceed.
                    </p>
                </div>
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
                                className="text-purple-400"
                            >
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold uppercase tracking-wider">Automate</h2>
                        <div className="mt-2">
                            <Link to="/" className="text-purple-600 hover:text-purple-800 text-sm">
                                Return to landing page
                            </Link>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-8 flex items-center">
                        <ShieldAlert className="mr-2 h-6 w-6 text-purple-600" />
                        Admin Login
                    </h1>

                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                            rememberMe: false
                        }}
                        validationSchema={adminLoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ }) => (
                            <Form className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Admin Email"
                                        className="w-full p-3 pl-10 rounded-md border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Admin Password"
                                        className="w-full p-3 pl-10 rounded-md border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
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

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Field
                                            type="checkbox"
                                            name="rememberMe"
                                            id="rememberMe"
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                                            User login
                                        </Link>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-black text-purple-400 font-semibold rounded-md hover:bg-gray-900 transition-colors mt-6"
                                >
                                    {isLoading ? "Authenticating..." : "Admin Login"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="flex justify-center items-center text-sm mt-6 pt-4 border-t border-gray-200">
                        <span>Need assistance?</span>
                        <a href="mailto:admin-support@automate.com" className="ml-2 font-semibold text-purple-600 hover:text-purple-800">
                            Contact support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
