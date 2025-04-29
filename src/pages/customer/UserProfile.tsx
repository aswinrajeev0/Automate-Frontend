"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/Tabs"
import ProfileSection from "../../components/customer/profile/ProfileSection"
import { Header } from "../../components/customer/Header"
import AddressSection from "../../components/customer/profile/AddressSection"
import AccountSection from "../../components/customer/profile/AccountSection"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"


const UserProfile = () => {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)
    const [activeTab, setActiveTab] = useState("profile")

    return (
        <>
            <Header />


            <div className="container mx-auto py-8 px-4 max-w-4xl">

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/profile">Profile</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="address">Address</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                    </TabsList>

                    <ProfileSection
                        isEditingProfile={isEditingProfile}
                        setIsEditingProfile={setIsEditingProfile}
                        isLoadingProfile={isLoadingProfile}
                        setIsLoadingProfile={setIsLoadingProfile}
                    />

                    <AddressSection
                        isEditingAddress={isEditingAddress}
                        setIsEditingAddress={setIsEditingAddress}
                        isLoadingAddress={isLoadingAddress}
                        setIsLoadingAddress={setIsLoadingAddress}
                    />

                    <AccountSection />

                </Tabs>
            </div>
        </>
    )
}

export default UserProfile

