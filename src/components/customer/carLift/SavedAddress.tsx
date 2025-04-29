import { BookmarkIcon } from "lucide-react"
import { useCustomerAddress } from "../../../hooks/customer/useCustomerProfile"

interface SavedAddressProps {
    handleLocationSelect: (address: string) => void
}

const SavedAddress: React.FC<SavedAddressProps> = ({handleLocationSelect}) => {

    const { data } = useCustomerAddress() || null
    const savedAddress = data

    return (
        <div className="space-y-4">
            {savedAddress ? (
                <div
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleLocationSelect(`${savedAddress.streetAddress}, ${savedAddress.city}, ${savedAddress.state}, ${savedAddress.country}`)}
                >
                    <div className="flex items-start">
                        <BookmarkIcon size={20} className="text-blue-500 mr-2 mt-1" />
                        <div>
                            <p className="font-medium">Your Address</p>
                            <p className="text-gray-600">{`${savedAddress.streetAddress}, ${savedAddress.city}, ${savedAddress.state}, ${savedAddress.country}`}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                // onClick={() => handleLocationSelect(savedAddress)}
                >
                    <div className="flex items-start">
                        You have no saved address
                    </div>
                </div>
            )}
        </div>
    )
}

export default SavedAddress