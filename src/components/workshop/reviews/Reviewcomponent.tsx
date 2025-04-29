import { MoreVertical } from "lucide-react";
import React, { JSX } from "react";
import { IReview } from "../../../hooks/customer/useWorkshops";

interface ReveiwComponentProps {
    reviews: IReview[]
    renderStars: (rating: number) => JSX.Element[]
}

const ReveiwComponent: React.FC<ReveiwComponentProps> = ({reviews, renderStars}) => {
    return (
        <>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.reviewId} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                                <img
                                    src={review.userId.image}
                                    alt={review.userId.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{review.userId.name}</h3>
                                    <div className="flex items-center">
                                        <div className="flex mr-2">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {/* <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <button className="flex items-center hover:text-blue-600">
                                <ThumbsUp size={16} className="mr-1" />
                                <span>{review.likes}</span>
                            </button>
                            <button className="flex items-center hover:text-blue-600">
                                <MessageCircle size={16} className="mr-1" />
                                <span>{review.comments}</span>
                            </button>
                            <button className="flex items-center hover:text-blue-600">
                                <Share2 size={16} className="mr-1" />
                                <span>Share</span>
                            </button>
                        </div> */}
                    </div>
                ))}
            </div>
        </>
    )
}

export default ReveiwComponent