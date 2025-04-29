import React from 'react';
import { Header } from '../../components/customer/Header';
import { Footer } from '../../components/customer/Footer';
import FavoriteWorkshopCards from '../../components/customer/favorites/WorkshopCards';

const FavoritesPage: React.FC = () => {

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Favorites</h1>
                    <p className="text-gray-600">All your favorite workshops in one place</p>
                </header>
                <FavoriteWorkshopCards />
            </div>
            <Footer />
        </>
    );
};

export default FavoritesPage;