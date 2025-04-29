"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table"
import { Button } from "../../ui/Button"
import { debounce } from "lodash"
import { useAllCustomersQuery } from "../../../hooks/admin/useAllCustomers"
import { getAllCustomers } from "../../../services/admin/adminService"
import { useUpdateCustomerStatusMutation } from "../../../hooks/admin/useUpdateCustomerStatus"
import { Pagination1 } from "../../admin/Pagination1"
import { Search } from "lucide-react"
import { Input } from "../../ui/Input"
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
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card"

export interface ICustomer {
    _id: string
    customerId: string
    name: string
    email: string
    phone: string
    isBlocked: boolean
}

export type CustomersData = {
    customers: ICustomer[]
    totalPages: number
}

const Customers: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
    const [currentPage, setCurrentPage] = useState(1)

    const limit = 10
    const { mutate: updateCustomerStatus } = useUpdateCustomerStatusMutation(currentPage, limit, debouncedSearch)

    function handleBlockStatus(customerId: string) {
        updateCustomerStatus(customerId)
    }

    useEffect(() => {
        const handler = debounce(() => setDebouncedSearch(searchQuery), 300)
        handler()
        return () => handler.cancel()
    }, [searchQuery])

    const { data, isLoading, isError } = useAllCustomersQuery(getAllCustomers, currentPage, limit, debouncedSearch)

    const customers = (data?.users ?? []) as ICustomer[]
    const totalPages = data?.totalPages || 1

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customers</h1>
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

            {/* Customer Table */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading customers...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-8">
                    <p className="text-red-500">Failed to load customers.</p>
                </div>
            ) : customers.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No customers found.</p>
                </div>
            ) : (
                <>
                    {/* Mobile view - Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {customers.map((customer, index) => (
                            <Card key={index} className="overflow-hidden">
                                <CardHeader className="bg-gray-100 py-3">
                                    <CardTitle className="text-sm font-medium">ID: {customer._id}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <div className="grid grid-cols-2 gap-1">
                                        <p className="text-sm font-medium">Name:</p>
                                        <p className="text-sm">{customer.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        <p className="text-sm font-medium">Email:</p>
                                        <p className="text-sm break-all">{customer.email}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        <p className="text-sm font-medium">Phone:</p>
                                        <p className="text-sm">{customer.phone}</p>
                                    </div>
                                    <div className="pt-2">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className={
                                                        customer.isBlocked
                                                            ? "bg-green-400 hover:bg-green-500 w-full"
                                                            : "bg-red-400 hover:bg-red-500 w-full"
                                                    }
                                                >
                                                    {customer.isBlocked ? "Unblock" : "Block"}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure you want to {customer.isBlocked ? "unblock" : "block"} this customer?
                                                    </AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleBlockStatus(customer._id)}>
                                                        Continue
                                                    </AlertDialogAction>
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
                                    {customers.map((customer, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="max-w-[100px] truncate">{customer.customerId}</TableCell>
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell>{customer.email}</TableCell>
                                            <TableCell>{customer.phone}</TableCell>
                                            <TableCell>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            className={
                                                                customer.isBlocked
                                                                    ? "bg-green-400 hover:bg-green-500 w-20"
                                                                    : "bg-red-400 hover:bg-red-500 w-20"
                                                            }
                                                        >
                                                            {customer.isBlocked ? "Unblock" : "Block"}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure you want to {customer.isBlocked ? "unblock" : "block"} this customer?
                                                            </AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleBlockStatus(customer._id)}>
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </>
            )}

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

export default Customers

