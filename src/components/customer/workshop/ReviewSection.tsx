import React from "react"
import { IReview } from "../../../hooks/customer/useWorkshops"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { MoreVertical, Star, ThumbsUp } from "lucide-react"
import { Button } from "../../ui/Button"
// import { Badge } from "../../ui/Badge"
import { Separator } from "../../ui/Separator"

interface ReviewSectionProps {
    reviews: IReview[];
    setShowRatingDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, setShowRatingDialog }) => {
    // Calculate average rating
    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="my-12 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                    <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={i < Math.round(Number(averageRating))
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-200"}
                                />
                            ))}
                        </div>
                        <span className="font-medium text-lg">{averageRating}</span>
                        <span className="text-gray-500 ml-2">({reviews?.length || 0} reviews)</span>
                    </div>
                </div>
                <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowRatingDialog(true)}
                >
                    Write a Review
                </Button>
            </div>

            <Separator className="mb-6" />

            {reviews && reviews.length > 0 ? (
                <div className="space-y-8">
                    {reviews.map((review) => {
                        const userName = typeof review.userId === "object" ? review.userId.name : "Anonymous User";
                        const image = typeof review.userId === "object" ? review.userId.image : "./mechs2.jpg";
                        const date = review.createdAt
                            ? new Date(review.createdAt)
                            : null;

                        return (
                            <div key={review.reviewId} className="group">
                                <div className="flex gap-4">
                                    <img
                                        src={image}
                                        alt={userName}
                                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{userName}</p>
                                                    {/* {review.verified && (
                                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                            Verified Purchase
                                                        </Badge>
                                                    )} */}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < review.rating
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-200"}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {date ? new Intl.DateTimeFormat('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }).format(date) : "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Report</DropdownMenuItem>
                                                    <DropdownMenuItem>Copy text</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
                                        <div className="flex items-center mt-3">
                                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
                                                <ThumbsUp size={14} />
                                                <span>Helpful</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {reviews.indexOf(review) < reviews.length - 1 && (
                                    <Separator className="mt-8" />
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setShowRatingDialog(true)}
                    >
                        Write a Review
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ReviewSection