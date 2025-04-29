import React, { useState } from "react";
import { TabsContent } from "../../ui/Tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Eye, EyeOff, KeyRound, LogOut, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../../ui/alert-dialog";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWorkshopLogout } from "../../../hooks/workshop/useWorkshopAuth";
import { workshopLogout } from "../../../store/slices/workshopSlice";
import { useChangeWorkshopPassword, useWorkshopDelete } from "../../../hooks/workshop/useWorkshopProfile";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Label } from "../../ui/Label";
import * as Yup from "yup"
import { Input } from "../../ui/Input";
import { ChangePasswordData } from "../../../types/auth";

const passwordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords don't match")
        .required("Please confirm your new password"),
})

const WorkshopAccountSection: React.FC = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const logout = useWorkshopLogout()
    const deleteAccount = useWorkshopDelete()
    const changePassword = useChangeWorkshopPassword()

    const handleLogout = async () => {
        const response = await logout.mutateAsync()
        if (response.success) {
            dispatch(workshopLogout())
            toast.success("Logged out successfully.")
            navigate("/workshop/login")
        }
    }

    const handleDeleteAccount = async () => {
        const response = await deleteAccount.mutateAsync()
        if (response.status === 200) {
            dispatch(workshopLogout())
            toast.success("Account deleted successfully")
            navigate("/workshop/login")
        }
    }

    // const handleChangePasswordSubmit = async (values: ChangePasswordData) => {
    //     try {
    //         setIsSubmittingPassword(true)

    //         await changePassword.mutateAsync({
    //             oldPassword: values.oldPassword,
    //             newPassword: values.newPassword,
    //             confirmPassword: values.confirmPassword
    //         });

    //         toast.success("Password changed successfully")
    //     } catch (error) {
    //         toast.error("Failed to change password")
    //         console.error(error)
    //     } finally {
    //         setIsSubmittingPassword(false)
    //     }
    // }

    return (
        <>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Management</CardTitle>
                        <CardDescription>Manage your account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="pt-6 border-t">
                            <h3 className="text-lg font-medium mb-2">Change Password</h3>
                            <p className="text-muted-foreground mb-4">Update your password to keep your account secure</p>

                            <Formik
                                initialValues={{
                                    oldPassword: "",
                                    newPassword: "",
                                    confirmPassword: "",
                                }}
                                validationSchema={passwordSchema}
                                onSubmit={async (values: ChangePasswordData, { resetForm, setSubmitting }) => {
                                    try {
                                        setIsSubmittingPassword(true);

                                        const response = await changePassword.mutateAsync({
                                            oldPassword: values.oldPassword,
                                            newPassword: values.newPassword,
                                            confirmPassword: values.confirmPassword,
                                        });

                                        toast.success(response.message || "Password changed successfully");
                                        resetForm();
                                    } catch (error: any) {
                                        toast.error(error.message || "Failed to change password");
                                        console.error(error);
                                    } finally {
                                        setIsSubmittingPassword(false);
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="oldPassword">Current Password</Label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="oldPassword"
                                                    name="oldPassword"
                                                    type={showOldPassword ? "text" : "password"}
                                                    placeholder="Enter your current password"
                                                    className="pr-10 border-input focus:ring-1 focus:ring-primary"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                                                    tabIndex={-1}
                                                >
                                                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="oldPassword" component="p" className="text-sm text-destructive" />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="Enter your new password"
                                                    className="pr-10 border-input focus:ring-1 focus:ring-primary"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                                                    tabIndex={-1}
                                                >
                                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="newPassword" component="p" className="text-sm text-destructive" />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm your new password"
                                                    className="pr-10 border-input focus:ring-1 focus:ring-primary"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="p" className="text-sm text-destructive" />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto"
                                            disabled={isSubmitting || isSubmittingPassword}
                                        >
                                            <KeyRound className="mr-2 h-4 w-4" />
                                            {isSubmitting || isSubmittingPassword ? "Changing..." : "Change Password"}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Logout</h3>
                            <p className="text-muted-foreground mb-4">Sign out from your current session</p>
                            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>

                        <div className="pt-6 border-t">
                            <h3 className="text-lg font-medium mb-2 text-destructive">Danger Zone</h3>
                            <p className="text-muted-foreground mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full sm:w-auto">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data
                                            from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete Account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    )
}

export default WorkshopAccountSection