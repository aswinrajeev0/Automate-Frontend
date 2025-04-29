import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/customer/Header';
import { Footer } from '../../components/customer/Footer';
import { IReview, IWorkshop, useWorkshopDetails } from '../../hooks/customer/useWorkshops';
import RatingDialog from '../../components/customer/workshop/RatingModal';
import WorkshopDetailsSection from '../../components/customer/workshop/WorkshopDetailsSection';
import ReviewSection from '../../components/customer/workshop/ReviewSection';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../../components/ui/breadcrumb';

const WorkshopDetail = () => {
    const { id } = useParams();
    const [showRatingDialog, setShowRatingDialog] = useState(false);

    const { data, isLoading, error } = useWorkshopDetails(id!)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500 text-lg">Loading workshop details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-red-500 text-lg">
                            Error loading workshop details: {error.message || 'Something went wrong'}
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-6">

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/workshop-details/${id}`}>Workshop</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <br />

                <WorkshopDetailsSection
                    reviewCount={data?.reviews.length || 0}
                    workshop={data?.workshop as IWorkshop}
                />

                <ReviewSection
                    reviews={data?.reviews as IReview[]}
                    setShowRatingDialog={setShowRatingDialog}
                />
            </div>

            <RatingDialog
                workshopId={data?.workshop.id as string}
                showRatingDialog={showRatingDialog}
                setShowRatingDialog={setShowRatingDialog}
            />

            <Footer />
        </div>
    );
};

export default WorkshopDetail;