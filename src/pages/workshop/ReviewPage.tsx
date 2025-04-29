import { Star } from 'lucide-react';
import ReveiwComponent from '../../components/workshop/reviews/Reviewcomponent';
import { IReview } from '../../hooks/customer/useWorkshops';
import { useWorkshopReview } from '../../hooks/workshop/reviews/useWorkshopReview';

const WorkshopReviews = () => {

    const {data} = useWorkshopReview()
    const reviews = (data?.reviews || []) as IReview[]

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
        ));
    };

    const avgRating = (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1);
    const totalReviews = reviews.length;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Header with summary */}
            <div className="border-b pb-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Workshop Reviews</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold text-gray-800 mr-2">{avgRating}</span>
                        <div className="flex">
                            {renderStars(Math.round(Number(avgRating)))}
                        </div>
                    </div>
                    <span className="text-gray-600">Based on {totalReviews} reviews</span>
                </div>
            </div>

            <ReveiwComponent reviews={reviews} renderStars={renderStars} />

            {/* Load more button */}
            {/* <div className="mt-6 text-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
                    Load More Reviews
                </button>
            </div> */}
        </div>
    );
};

export default WorkshopReviews;