import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
                    <div>
                        <p className="text-rose-700 font-bold text-lg">|| शौर्यं तेजः धृतिर्दाक्ष्यं ||</p>
                        <p className="text-gray-500 text-sm italic">"Heroism, Radiance, Resolution, Capability"</p>
                    </div>
                    <p className="text-gray-500">
                        © 2026 Lodha Samaj Matrimony. All rights reserved.
                    </p>
                    <p className="mt-1 text-gray-400 text-xs">
                        Developed by <a href="https://github.com/br-lovanshi" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 underline">Brajesh Lovanshi</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

