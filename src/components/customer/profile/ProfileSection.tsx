import React, { useEffect, useState } from "react";
import { TabsContent } from "../../ui/Tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/Avatar";
import { Label } from "../../ui/Label";
import { Input } from "../../ui/Input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/Form";
import { Loader2, Pencil, Phone, Save, User } from "lucide-react";
import { Button } from "../../ui/Button";
import * as yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { CustomerEditUploadData } from "../../../types/auth";
import { Textarea } from "../../ui/Textarea";
import { uploadImage } from "../../../services/cloudinary/cloudinary";
import { customerLogin } from "../../../store/slices/customerSlice";
import { useToaster } from "../../../hooks/ui/useToaster";
import { useCustomerUpdateProfile } from "../../../hooks/customer/useCustomerProfile";

const profileSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    // email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
        .string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits")
        .required("Phone number is required"),
    bio: yup.string().max(300, "Bio must be at most 300 characters"),
})

type ProfileFormValues = yup.InferType<typeof profileSchema>

interface ProfileSectionProps {
    isEditingProfile: boolean;
    setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingProfile: boolean;
    setIsLoadingProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ isEditingProfile, setIsEditingProfile, isLoadingProfile, setIsLoadingProfile }) => {

    const { customer } = useSelector((state: RootState) => state.customer)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { successToast, errorToast } = useToaster();
    const customerUpdate = useCustomerUpdateProfile();
    const dispatch = useDispatch();

    const defaultProfileValues: ProfileFormValues = {
        name: customer?.name || "",
        // email: customer?.email || "",
        phone: customer?.phone || "",
        bio: customer?.bio || "",
    }

    //Car enthusiast and regular customer. I own a 2018 Honda Civic and a 2015 Toyota Camry.

    const profileForm = useForm<ProfileFormValues>({
        resolver: yupResolver(profileSchema),
        defaultValues: defaultProfileValues,
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file)
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    }

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        }
    }, [imagePreview])

    const onSubmitProfile = async (values: ProfileFormValues) => {
        try {
            setIsLoadingProfile(true)
            let imageUrl = customer?.image || undefined;

            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile) || undefined;
            }

            const customerEditData: CustomerEditUploadData = {
                id: customer?.id,
                name: values.name,
                // email: values.email,
                phone: values.phone,
                bio: values.bio,
                image: imageUrl
            }

            const response = await customerUpdate.mutateAsync(customerEditData)
            if (response.status === 200) {
                successToast(response.data.message)
                dispatch(customerLogin(response.data.user))
                setImagePreview(null);
                setSelectedFile(null);
                setIsEditingProfile(false)
            }
        } catch (error: any) {
            errorToast(error.response.data.message)
        }
        finally {
            setIsLoadingProfile(false)
        }
    }

    const handleEditProfileToggle = () => {
        if (isEditingProfile) {
            profileForm.reset(defaultProfileValues)
            setSelectedFile(null);
            setImagePreview(null);
        }
        setIsEditingProfile(!isEditingProfile)
    }


    return (
        <>
            <TabsContent value="profile">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Picture Card */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <Label htmlFor="picture" className={isEditingProfile ? "cursor-pointer" : ""}>
                                <Avatar className="w-32 h-32 mb-4">
                                    <AvatarImage src={
                                        imagePreview ||
                                        (customer?.name ? customer?.image : "https://github.com/shadcn.png")
                                    } alt={customer?.name} />
                                    <AvatarFallback className="text-3xl">
                                        {defaultProfileValues.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </Label>


                            <div className="w-full mt-4">
                                {/* <Label htmlFor="picture" className="text-center block mb-2">
                                    Update Picture
                                </Label> */}
                                <Input
                                    id="picture"
                                    type="file"
                                    accept="image/*"
                                    disabled={!isEditingProfile}
                                    className="cursor-pointer hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>

                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)}>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={profileForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input {...field} disabled={!isEditingProfile} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input {...field} disabled={!isEditingProfile} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /> */}

                                    <FormField
                                        control={profileForm.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input {...field} disabled={!isEditingProfile} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={profileForm.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        disabled={!isEditingProfile}
                                                        rows={3}
                                                        placeholder="Tell us a bit about yourself"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>

                                <CardFooter className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant={isEditingProfile ? "outline" : "default"}
                                        onClick={handleEditProfileToggle}
                                    >
                                        {isEditingProfile ? (
                                            "Cancel"
                                        ) : (
                                            <>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Profile
                                            </>
                                        )}
                                    </Button>

                                    {isEditingProfile && (
                                        <Button type="submit" disabled={isLoadingProfile}>
                                            {isLoadingProfile ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </div>
            </TabsContent>
        </>
    )
}

export default ProfileSection;