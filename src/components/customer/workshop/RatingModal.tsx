import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "../../ui/Dialog";
import { Textarea } from "../../ui/Textarea";
import { Button } from "../../ui/button";
import { Star } from "lucide-react";
import { IReview, useSubmitReview, WorkshopDetailsResponse } from "../../../hooks/customer/useWorkshops";
import { useToaster } from "../../../hooks/ui/useToaster";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { generateUniqueId } from "../../../utils/uuid";

interface RatingDialogProps {
    workshopId: string;
    showRatingDialog: boolean;
    setShowRatingDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const RatingDialog: React.FC<RatingDialogProps> = ({ workshopId, showRatingDialog, setShowRatingDialog }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    const { successToast, errorToast } = useToaster()
    const {customer} = useSelector((state: RootState) => state.customer)

    const submitReview = useSubmitReview()

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a rating before submitting.");
            return;
        }

        setLoading(true);

        const guestId = generateUniqueId("guest")

        const optimisticReview: IReview = {
            reviewId: `temp-${Date.now()}`,
            workshopId,
            userId: { _id: customer?.id || guestId, name: customer?.name || "Guest" },
            rating,
            comment,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        queryClient.setQueryData<WorkshopDetailsResponse>(["workshop-details", workshopId], (oldData) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                reviews: [...oldData.reviews, optimisticReview],
            };
        });

        try {
            const response = await submitReview.mutateAsync({ workshopId, rating, comment })
            if (response.status === 201) {
                successToast("Your review has been submitted")

                queryClient.setQueryData<WorkshopDetailsResponse>(["workshop-details", workshopId], (oldData) => {
                    if (!oldData) return oldData;
                    const newReview = response.data.review;
                    return {
                        ...oldData,
                        reviews: oldData.reviews.map((r) =>
                            r.reviewId === optimisticReview.reviewId ? newReview : r
                        ),
                    };
                });

                setRating(0);
                setComment('');
                setShowRatingDialog(false);
            } else {
                errorToast(response.data?.message || "Error submitting review")
                queryClient.setQueryData<WorkshopDetailsResponse>(["workshop-details", workshopId], (oldData) =>
                    oldData ? { ...oldData, reviews: oldData.reviews.filter((r) => r.reviewId !== optimisticReview.reviewId) } : oldData
                );
            }
        } catch (error: any) {
            errorToast(error.response?.data || "Something went wrong")
            queryClient.setQueryData<WorkshopDetailsResponse>(["workshop-details", workshopId], (oldData) =>
                oldData ? { ...oldData, reviews: oldData.reviews.filter((r) => r.reviewId !== optimisticReview.reviewId) } : oldData
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setShowRatingDialog(open);
        if (!open) {
            setRating(0);
            setComment('');
        }
    };

    return (
        <Dialog open={showRatingDialog} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center relative">
                        Rate Our App!
                        <DialogClose className="absolute right-0 top-0" />
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-center text-sm mb-4">Help us improve our tool to best suit your needs by rating us here!</p>
                    <div className="flex justify-center gap-2 my-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="p-2"
                                disabled={loading}
                            >
                                <Star
                                    className={`h-6 w-6 ${rating >= star ? "text-green-400 fill-green-400" : "text-gray-300"}`}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        <p className="text-sm mb-2">Can you tell us more?</p>
                        <Textarea
                            placeholder="Add feedback"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full"
                            disabled={loading}
                        />
                    </div>
                </div>
                <DialogFooter className="flex space-x-2 justify-between">
                    <Button variant="outline" onClick={() => setShowRatingDialog(false)} className="flex-1" disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RatingDialog;