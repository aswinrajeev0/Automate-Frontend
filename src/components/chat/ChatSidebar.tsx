import { Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { IConversationType, IFallbackUser } from "../../types/chat.type";
import { useMarkAsRead } from "../../hooks/chat/useChat";

interface ChatSidebarProps {
    conversations: IConversationType[];
    selectedConversationId: string | null;
    onSelectConversation: (id: string) => void;
    userType: "customer" | "workshop";
    fallbackUsers: IFallbackUser[];
    onStartConversation: (userId: string) => any
}

const ChatSidebar = ({
    conversations,
    selectedConversationId,
    onSelectConversation,
    userType,
    fallbackUsers,
    onStartConversation
}: ChatSidebarProps) => {

    const markAsRead = useMarkAsRead(userType);

    return (
        <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations"
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                    conversations.map((conversation) => {
                        const displayName =
                            userType === "customer"
                                ? conversation.workshopName
                                : conversation.customerName;

                        const initial = displayName.charAt(0).toUpperCase();
                        const lastMessage =
                            conversation.latestMessage;

                        return (
                            <div
                                key={conversation._id}
                                onClick={async () => {
                                    await markAsRead.mutateAsync(conversation._id)
                                    onSelectConversation(conversation._id)
                                }}
                                className={cn(
                                    "px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors",
                                    selectedConversationId === conversation._id
                                        ? "bg-blue-50"
                                        : "hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-center">
                                    {(userType === "customer" ? conversation.workshopId?.image : conversation.customerId?.image) ? (
                                        <img
                                            src={userType === "customer" ? conversation.workshopId.image : conversation.customerId.image}
                                            alt="Profile"
                                            className="h-10 w-10 rounded-full object-cover mr-3"
                                        />
                                    ) : (
                                        <div
                                            className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center text-white mr-3",
                                                userType === "customer" ? "bg-orange-500" : "bg-blue-500"
                                            )}
                                        >
                                            {initial}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-gray-900 truncate">
                                                {displayName}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                {conversation.unreadCount > 0 && (
                                                    <span className="inline-block min-w-[20px] px-1 text-xs text-white bg-red-500 rounded-full text-center">
                                                        {conversation.unreadCount}
                                                    </span>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    {new Date(lastMessage?.timestamp).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate mt-1">
                                            {lastMessage?.sender === userType
                                                ? `You: ${lastMessage?.content}`
                                                : `${displayName}: ${lastMessage?.content}`}

                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-4 text-sm text-gray-600">
                        <p className="mb-3">No conversations yet. Start chatting with a {userType === "customer" ? "workshop" : "customer"}:</p>
                        <div className="space-y-2">
                            {fallbackUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => onStartConversation(user._id)}
                                    className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    {user.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ChatSidebar;