import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema } from "../../utils/validations/customerValidations/loginvalidator";
import { WorkshopLoginFormValues, WorkshopLoginData } from "../../types/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/ui/useToast";
import { useWorkshopLogin } from "../../hooks/workshop/useWorkshopAuth";
import { useDispatch } from "react-redux";
import { workshopLogin } from "../../store/slices/workshopSlice";
import mechs2 from "../../assets/mechs2.jpg"

export default function WorkshopLoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const loginWorkshop = useWorkshopLogin();

    const handleSubmit = async (values: WorkshopLoginFormValues) => {
        try {
            setIsLoading(true);

            const loginData: WorkshopLoginData = {
                email: values.email,
                password: values.password
            }
            const response = await loginWorkshop.mutateAsync(loginData)
            console.log(response)

            if (response.success) {
                toast({
                    title: "Success",
                    description: "You have successfully logged in",
                });
                dispatch(workshopLogin(response.workshop))
                navigate("/workshop");
            }

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Invalid email or password",
                variant: "destructive",
            });
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side with illustration - 1/2 of the page */}

            {/* Right side with form - 1/2 of the page */}
            <div className="w-full md:w-1/2 bg-red-100 p-8 flex flex-col justify-center">
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

                    <h1 className="text-3xl font-bold mb-8">Workshop Login</h1>

                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ }) => (
                            <Form className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="w-full p-3 pl-10 rounded-md border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        className="w-full p-3 pl-10 rounded-md border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-700"
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
                                    <div className="text-sm">
                                        <a href="/workshop/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-black text-red-600 font-semibold rounded-md hover:bg-gray-900 transition-colors mt-6"
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="relative flex items-center justify-center my-4">
                        <div className="border-t border-gray-300 w-full"></div>
                        <span className="bg-white px-2 text-gray-500 text-sm z-10">OR</span>
                        <div className="border-t border-gray-300 w-full"></div>
                    </div>

                    <div className="flex justify-center items-center text-sm mt-4">
                        <span>Don't have an account?</span>
                        <a href="/workshop/signup" className="ml-2 font-semibold underline">Sign up</a>
                    </div>

                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 bg-blend-color items-center justify-center p-8">
                <img
                    src={mechs2}
                    alt="Auto mechanics working on a car"
                    className="object-contain w-full max-w-lg h-full"
                />
            </div>

        </div>
    );
}
