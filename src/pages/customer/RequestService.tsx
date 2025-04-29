import React from "react";
import { Header } from "../../components/customer/Header";
import { Footer } from "../../components/customer/Footer";
import CtaSection from "../../components/customer/service/CtaSection";
import ChooseUs from "../../components/customer/service/ChooseUsSection";
import FeaturedServices from "../../components/customer/service/FeaturesServices";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../components/ui/breadcrumb";
import { useParams } from "react-router-dom";

const ServicesPage: React.FC = () => {

    const {workshopId} = useParams()

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-12">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/workshop-details/${workshopId}`}>Workshop</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/request-service/${workshopId}`}>Services</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Automotive Services</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Professional automotive solutions tailored to your needs. Choose the service that works for you.
                    </p>
                </div>

                {/* Featured Services */}
                <FeaturedServices />

                {/* Why Choose Us Section */}
                <ChooseUs />

                {/* CTA Section */}
                <CtaSection />
            </div>
            <Footer />
        </>
    );
};

export default ServicesPage;