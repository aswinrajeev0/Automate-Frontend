"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "../../components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Search } from "lucide-react"
import { Header } from "../../components/customer/Header"
import { Footer } from "../../components/customer/Footer"
import { IWorkshopWithRating } from "../../types/workshop.type"
import { useWorkshopsQuery } from "../../hooks/customer/useWorkshops"
import debounce from "lodash/debounce"
import { Pagination1 } from "../../components/admin/Pagination1"
import WorkshopDisplaySection from "../../components/customer/workshop/WorkshopDisplaySection"

type SortOptionType = "all" | "alphabetic-asc" | "alphabetic-desc" | "rating-high" | "rating-low"

const WorkshopsPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("")
    const [locationFilter, setLocationFilter] = useState<string>("all")
    const [sortOption, setSortOption] = useState<SortOptionType>("all")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isLoading] = useState<boolean>(false)
    const [isError] = useState<boolean>(false)

    const limit = 8;

    const { data } = useWorkshopsQuery(currentPage, limit, debouncedSearchQuery, sortOption)
    const workshops = (data?.workshops as IWorkshopWithRating[]) || []
    const totalWorkshops = data?.totalWorkshops || 1;
    const totalPages = Math.ceil(totalWorkshops / limit) || 1

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setDebouncedSearchQuery(query)
        }, 500),
        []
    )

    useEffect(() => {
        debouncedSearch(searchQuery)
        return () => {
            debouncedSearch.cancel()
        }
    }, [searchQuery, debouncedSearch])

    const locations = [...new Set(workshops.map((workshop) => workshop.city))]

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="bg-white p-4 md:p-6 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-yellow-500 animate-spin mb-4"></div>
                    <p className="text-gray-700 font-medium">Loading workshops...</p>
                </div>
                <Footer />
            </>
        )
    }

    if (isError) {
        return (
            <>
                <Header />
                <div className="bg-white p-4 md:p-6 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
                    <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded mb-4 max-w-md">
                        <h3 className="text-red-700 font-medium mb-2">Unable to load workshops</h3>
                        <p className="text-red-600">There was an error while fetching the workshops. Please try again later.</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="bg-gray-50 min-h-[calc(100vh-200px)]">
                <div className="container mx-auto px-4 py-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <a href="/" className="text-gray-600 hover:text-yellow-500">
                                Home
                            </a>
                            <span className="text-gray-400">/</span>
                            <span className="text-yellow-500 font-medium">Workshops</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Find Auto Workshops</h1>
                        <p className="text-gray-600 mt-1">Discover and connect with top-rated automotive workshops</p>
                    </div>

                    {/* Search & Filter Section */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="search"
                                    placeholder="Search workshops by name or location..."
                                    className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">

                                <div className="w-full md:w-48">
                                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200">
                                            <SelectValue placeholder="Location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Locations</SelectItem>
                                            {locations.map((location) => (
                                                <SelectItem key={location} value={location}>
                                                    {location}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-full md:w-48">
                                    <Select value={sortOption} onValueChange={(value: SortOptionType) => setSortOption(value)}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Sort by</SelectItem>
                                            <SelectItem value="alphabetic-asc">Name (A-Z)</SelectItem>
                                            <SelectItem value="alphabetic-desc">Name (Z-A)</SelectItem>
                                            <SelectItem value="rating-high">Highest Rated</SelectItem>
                                            <SelectItem value="rating-low">Lowest Rated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <WorkshopDisplaySection
                        filteredWorkshops={workshops}
                        sortOption={sortOption}
                        locationFilter={locationFilter}
                        searchQuery={searchQuery}
                    />

                    <Pagination1
                        currentPage={currentPage}
                        onPageNext={() => setCurrentPage(currentPage + 1)}
                        onPagePrev={() => setCurrentPage(currentPage - 1)}
                        totalPages={totalPages}
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default WorkshopsPage