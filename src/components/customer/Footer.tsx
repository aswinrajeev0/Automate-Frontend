
export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Open Designers</h3>
                        <p className="text-gray-400 text-sm">
                            Open source is source code that is made freely available for possible modification and redistribution.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Explore</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Go pro</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Explore Designs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Create Designs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Playoffs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Innovate</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Tags</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Places</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Creative Markets</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">About</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Designers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms of service</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}