import React, { useEffect } from "react";
import { TabsContent } from "../../ui/Tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/Card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/Form";
import { Building, Globe, Home, Loader2, MapPin, Pencil, Save } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { ICustomerAddress, useCustomerAddress, useEditCustomerAddress } from "../../../hooks/customer/useCustomerProfile";

const addressSchema = yup.object().shape({
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    streetAddress: yup.string().required("Street address is required"),
    buildingNo: yup.string().required("Building number is required"),
});

type AddressFormValues = yup.InferType<typeof addressSchema>;

interface AddressSectionProps {
    isEditingAddress: boolean;
    setIsEditingAddress: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingAddress: boolean;
    setIsLoadingAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddressSection: React.FC<AddressSectionProps> = ({
    isEditingAddress,
    setIsEditingAddress,
    isLoadingAddress,
    setIsLoadingAddress,
}) => {
    const { data, isLoading: isFetching, error, isError } = useCustomerAddress();
    const editAddress = useEditCustomerAddress();

    const addressForm = useForm<AddressFormValues>({
        resolver: yupResolver(addressSchema),
        defaultValues: {
            country: "",
            state: "",
            city: "",
            streetAddress: "",
            buildingNo: "",
        },
    });

    useEffect(() => {
        if (data) {
            console.log("Fetched customer address data:", data);
            addressForm.reset({
                country: data.country || "",
                state: data.state || "",
                city: data.city || "",
                streetAddress: data.streetAddress || "",
                buildingNo: data.buildingNo || "",
            });
        }
    }, [data, addressForm]);

    const onSubmitAddress = async (values: AddressFormValues) => {
        const editAddressData: ICustomerAddress = {
            country: values.country,
            state: values.state,
            city: values.city,
            streetAddress: values.streetAddress,
            buildingNo: values.buildingNo,
        };

        try {
            setIsLoadingAddress(true);
            await editAddress.mutateAsync(editAddressData);
            toast.success("Address updated successfully");
            setIsEditingAddress(false);
        } catch (err) {
            console.error("Error updating address:", err);
            toast.error("Failed to update address");
        } finally {
            setIsLoadingAddress(false);
        }
    };

    const handleEditAddressToggle = () => {
        if (isEditingAddress) {
            addressForm.reset({
                country: data?.country || "",
                state: data?.state || "",
                city: data?.city || "",
                streetAddress: data?.streetAddress || "",
                buildingNo: data?.buildingNo || "",
            });
        }
        setIsEditingAddress(!isEditingAddress);
    };

    if (isFetching) {
        return (
            <TabsContent value="address">
                <Card>
                    <CardHeader>
                        <CardTitle>Address Information</CardTitle>
                        <CardDescription>Loading address details...</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        );
    }

    if (isError) {
        return (
            <TabsContent value="address">
                <Card>
                    <CardHeader>
                        <CardTitle>Address Information</CardTitle>
                        <CardDescription>Error loading address: {error?.message}</CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="address">
            <Card>
                <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                    <CardDescription>Update your address details</CardDescription>
                </CardHeader>

                <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onSubmitAddress)}>
                        <CardContent className="space-y-4">
                            {isEditingAddress ? (
                                <>
                                    <FormField
                                        control={addressForm.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={addressForm.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                            <Input {...field} className="pl-10" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={addressForm.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                            <Input {...field} className="pl-10" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={addressForm.control}
                                        name="streetAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street Address</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={addressForm.control}
                                        name="buildingNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Building/Apartment Number</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <p><Globe className="inline h-4 w-4 mr-2" /> Country: {data?.country || "N/A"}</p>
                                    <p><MapPin className="inline h-4 w-4 mr-2" /> State: {data?.state || "N/A"}</p>
                                    <p><MapPin className="inline h-4 w-4 mr-2" /> City: {data?.city || "N/A"}</p>
                                    <p><Home className="inline h-4 w-4 mr-2" /> Street: {data?.streetAddress || "N/A"}</p>
                                    <p><Building className="inline h-4 w-4 mr-2" /> Building No: {data?.buildingNo || "N/A"}</p>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant={isEditingAddress ? "outline" : "default"}
                                onClick={handleEditAddressToggle}
                            >
                                {isEditingAddress ? "Cancel" : (
                                    <>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Address
                                    </>
                                )}
                            </Button>

                            {isEditingAddress && (
                                <Button type="submit" disabled={isLoadingAddress || editAddress.isPending}>
                                    {isLoadingAddress || editAddress.isPending ? (
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
        </TabsContent>
    );
};

export default AddressSection;