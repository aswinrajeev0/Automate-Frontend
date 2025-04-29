import { useState, useEffect, useRef } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatConversation from "../../components/chat/ChatConversation";
import { Header } from "../../components/customer/Header";
import { useFallbackUsers, useFetchConversations, useStartChat } from "../../hooks/chat/useChat";
import { IConversationType, IFallbackUser } from "../../types/chat.type";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useSearchParams } from "react-router-dom";

interface ChatInterfaceProps {
    userType: "customer" | "workshop";
}

const ChatInterface = ({ userType }: ChatInterfaceProps) => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [conversationsState, setConversationsState] = useState<IConversationType[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchParams] = useSearchParams();
    const workshopIdFromQuery = searchParams.get("workshopId");

    const hasStartedRef = useRef(false);

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setShowSidebar(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data: fetchConversationData, refetch } = useFetchConversations(userType);
    useEffect(() => {
        if (fetchConversationData?.conversations) {
            setConversationsState(fetchConversationData.conversations);
        }
    }, [fetchConversationData?.conversations]);

    useEffect(() => {
        if (
            userType === "customer" &&
            workshopIdFromQuery &&
            fetchConversationData?.conversations &&
            !hasStartedRef.current
        ) {
            hasStartedRef.current = true;

            const existingConversation = (fetchConversationData?.conversations as IConversationType[]).find(
                (conv) => conv.workshopId === workshopIdFromQuery
            );

            if (existingConversation) {
                setSelectedConversationId(existingConversation._id);
            } else {
                onStartConversation(workshopIdFromQuery);
            }
        }
    }, [userType, workshopIdFromQuery, fetchConversationData?.conversations]);


    const { data: fallbackUsersData } = useFallbackUsers(userType);
    const fallbackUsers = (fallbackUsersData?.users || []) as IFallbackUser[];

    const startChat = useStartChat(userType);

    const { customer } = useSelector((state: RootState) => state.customer);
    const { workshop } = useSelector((state: RootState) => state.workshop);

    const onStartConversation = async (userId: string) => {
        console.log("onStartConversation")
        if (userType === "customer") {
            try {
                const customerId = customer?.id as string;
                const workshopId = userId;

                const chat = await startChat.mutateAsync({ customerId, workshopId });
                await refetch()

                handleSelectConversation(chat._id);
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                const customerId = userId;
                const workshopId = workshop?.id as string;
                const chat = await startChat.mutateAsync({ customerId, workshopId });
                handleSelectConversation(chat._id);
            } catch (error) {
                console.error(error)
            }
        }
    };

    const selectedConversation = conversationsState.find(
        (conversation) => conversation._id === selectedConversationId
    );

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {userType === "customer" && <Header />}

            <div className="flex flex-1 w-full px-4 md:px-6 lg:px-8 xl:px-12 py-4 relative">
                <button
                    onClick={toggleSidebar}
                    className="fixed bottom-6 right-6 z-20 md:hidden bg-blue-500 text-white p-3 rounded-full shadow-lg"
                >
                    {showSidebar ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className={`
          fixed md:relative z-10 
          ${showSidebar ? "left-0" : "-left-full"}
          transition-all duration-300 ease-in-out
          md:left-0 top-0 md:top-auto
          h-full w-full sm:w-80 md:w-72 lg:w-80
          bg-white md:bg-transparent
          md:translate-x-0
          ${userType === "customer" ? "pt-16 md:pt-0" : ""}
        `}>
                    {showSidebar && (
                        <ChatSidebar
                            conversations={conversationsState}
                            selectedConversationId={selectedConversationId}
                            onSelectConversation={handleSelectConversation}
                            userType={userType}
                            fallbackUsers={fallbackUsers}
                            onStartConversation={onStartConversation}
                        />
                    )}
                </div>

                <div className={`
          flex-1 transition-all duration-300
          ${showSidebar ? "md:ml-4" : ""}
          bg-white rounded-lg overflow-hidden shadow-sm
          border border-gray-200
          flex flex-col
        `}>
                    {selectedConversation ? (
                        <ChatConversation
                            conversation={selectedConversation}
                            userType={userType}
                            onNewMessage={(newMsg) => {
                                setConversationsState((prev) =>
                                    prev.map((conv) =>
                                        conv._id === selectedConversation._id
                                            ? { ...conv, latestMessage: newMsg }
                                            : conv
                                    )
                                );
                            }}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
                            <MessageCircle className="h-12 w-12 mb-3 opacity-20" />
                            <p className="text-base lg:text-lg font-medium text-center">
                                Select a conversation to start chatting
                            </p>
                            {!showSidebar && (
                                <button
                                    onClick={toggleSidebar}
                                    className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md"
                                >
                                    Open Conversations
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;