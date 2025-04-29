import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/Tabs"
import WorkshopProfileSection from "./WorkshopProfileSection"
import WorkshopAddressSection from "./WorkshopAddressSection"
import WorkshopAccountSection from "./WorkshopAccountSection"

function ProfileContent() {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)
    const [activeTab, setActiveTab] = useState("profile")

    return (
        <>
            <div className="container mx-auto py-8 px-4 max-w-4xl">

                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="address">Address</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                    </TabsList>

                    <WorkshopProfileSection
                        isEditingProfile={isEditingProfile}
                        setIsEditingProfile={setIsEditingProfile}
                        isLoadingProfile={isLoadingProfile}
                        setIsLoadingProfile={setIsLoadingProfile}
                    />

                    <WorkshopAddressSection
                        isEditingAddress={isEditingAddress}
                        setIsEditingAddress={setIsEditingAddress}
                        isLoadingAddress={isLoadingAddress}
                        setIsLoadingAddress={setIsLoadingAddress}
                    />

                    <WorkshopAccountSection />

                </Tabs>
            </div>
        </>
    )
}

export default ProfileContent
