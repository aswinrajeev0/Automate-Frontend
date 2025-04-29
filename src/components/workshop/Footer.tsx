import React from "react";
import { Button } from "../ui/Button";

const Footer: React.FC = () => {
    return (
        <footer className="mt-12 bg-black text-white p-8 -mx-6 -mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-bold mb-4">Open Designers</h3>
                    <p className="text-sm text-gray-300">
                        Open source is source code that is made freely available for possible modification and redistribution. Products include permission to use the source code, design documents, or content of the product.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" /></svg>
                        </Button>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </Button>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                        </Button>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">Explore</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-300 hover:text-white">Go pro</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Explore Designs</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Create Designs</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Playoffs</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">Innovate</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-300 hover:text-white">Tags</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">API</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Places</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Creative Markets</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">About</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-300 hover:text-white">Community</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Designers</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Support</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Terms of service</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;