"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table"
import { Button } from "../../ui/button"
import { debounce } from "lodash"
import { getAllWorkshops } from "../../../services/admin/adminService"
import { useUpdateWorkshopStatusMutation } from "../../../hooks/admin/useUpdateWorkshopStatus"
import { Pagination1 } from "../Pagination1"
import { Eye, Search } from "lucide-react"
import { Input } from "../../ui/Input"
import { useAllWorkshopsQuery } from "../../../hooks/admin/useAllWorkshops"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/Dialog"
import WorkshopDetails from "./WorkshopDetails"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card"

export interface IWorkshop {
    _id: string
    workshopId: string
    name: string
    email: string
    phone: string
    country: string
    state: string
    city: string
    streetAddress: string
    buildingNo: string
    isBlocked: boolean
    approvalStatus: string
    createdAt: Date
    rejectionReason: string
}

export type WorkshopData = {
    workshops: IWorkshop[]
    totalPages: number
}

const Workshops: React.FC = () => {
    const limit = 10
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
    const [viewDetails, setViewDetails] = useState<IWorkshop | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const { mutate: updateWorkshopStatus } = useUpdateWorkshopStatusMutation(currentPage, limit, debouncedSearch)
    const [detailsOpen, setDetailsOpen] = useState(false)

    function handleBlockStatus(workshopId: string) {
        updateWorkshopStatus(workshopId)
    }

    useEffect(() => {
        const handler = debounce(() => setDebouncedSearch(searchQuery), 300)
        handler()
        return () => handler.cancel()
    }, [searchQuery])

    const { data, isLoading, isError } = useAllWorkshopsQuery<WorkshopData>(
        getAllWorkshops,
        currentPage,
        limit,
        debouncedSearch,
    )

    const allWorkshops = (data?.workshops ?? []) as IWorkshop[]

    // Filter out workshops with "approved" status
    const workshops = allWorkshops.filter((workshop) => workshop.approvalStatus === "approved")
    const totalPages = data?.totalPages || 1

    function handleViewDetails(workshop: IWorkshop) {
        setViewDetails(workshop)
        setDetailsOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Workshops</h1>
                <div className="relative flex w-full sm:w-64 items-center">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-black/70" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8 bg-black/5 border-black/20 text-black placeholder:text-black/40"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Workshop Table */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading workshops...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-8">
                    <p className="text-red-500">Failed to load workshops.</p>
                </div>
            ) : workshops.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No workshops found.</p>
                </div>
            ) : (
                <>
                    {/* Mobile view - Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {workshops.map((workshop) => (
                            <Card key={workshop._id} className="overflow-hidden">
                                <CardHeader className="bg-gray-100 py-3">
                                    <CardTitle className="text-sm font-medium">ID: {workshop.workshopId}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <div className="grid grid-cols-2 gap-1">
                                        <p className="text-sm font-medium">Name:</p>
                                        <p className="text-sm">{workshop.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        <p className="text-sm font-medium">Email:</p>
                                        <p className="text-sm break-all">{workshop.email}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        <p className="text-sm font-medium">Phone:</p>
                                        <p className="text-sm">{workshop.phone}</p>
                                    </div>
                                    <div className="pt-2 flex flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(workshop)}
                                            className="w-full"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className={workshop.isBlocked ?
                                                        "bg-green-400 hover:bg-green-500 w-full" :
                                                        "bg-red-400 hover:bg-red-500 w-full"
                                                    }
                                                >
                                                    {workshop.isBlocked ? "Unblock" : "Block"}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure you want to {workshop.isBlocked ? "unblock" : "block"} this workshop?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleBlockStatus(workshop._id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Desktop view - Table */}
                    <div className="hidden md:block bg-white rounded-md shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-100">
                                    <TableRow>
                                        <TableHead className="font-bold">Id</TableHead>
                                        <TableHead className="font-bold">Name</TableHead>
                                        <TableHead className="font-bold">Email</TableHead>
                                        <TableHead className="font-bold">Phone</TableHead>
                                        <TableHead className="font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workshops.map((workshop) => (
                                        <TableRow key={workshop._id}>
                                            <TableCell className="max-w-[100px] truncate">{workshop.workshopId}</TableCell>
                                            <TableCell>{workshop.name}</TableCell>
                                            <TableCell>{workshop.email}</TableCell>
                                            <TableCell>{workshop.phone}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(workshop)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                className={workshop.isBlocked ?
                                                                    "bg-green-400 hover:bg-green-500 w-20" :
                                                                    "bg-red-400 hover:bg-red-500 w-20"
                                                                }
                                                            >
                                                                {workshop.isBlocked ? "Unblock" : "Block"}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure you want to {workshop.isBlocked ? "unblock" : "block"} this workshop?</AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleBlockStatus(workshop._id)}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </>
            )}

            {/* Workshop Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Workshop Details</DialogTitle>
                        <DialogDescription>Complete information about the workshop registration.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4 flex-1 overflow-y-auto max-h-[60vh] px-2">
                        {viewDetails && (
                            <WorkshopDetails viewDetails={viewDetails} />
                        )}
                    </div>
                    <div className="mt-4 flex justify-en">

                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline" onClick={() => setDetailsOpen(false)}>                  Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center">
                <Pagination1
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageNext={() => setCurrentPage(currentPage + 1)}
                    onPagePrev={() => setCurrentPage(currentPage - 1)}
                />
            </div>
        </div>
    )
}

export default Workshops

