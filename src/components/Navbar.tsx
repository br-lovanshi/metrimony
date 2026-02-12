import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UserPlus, Users, Lock } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'View Profiles', path: '/profiles', icon: Users },
        { name: 'Submit Profile', path: '/submit', icon: UserPlus },
    ];

    const adminLink = { name: 'Admin', path: '/admin/dashboard', icon: Lock };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex flex-col">
                            <span className="text-2xl font-bold text-rose-600">Lodha Samaj Matrimony</span>
                            <span className="text-xs text-rose-800 font-semibold tracking-wider">|| शौर्यं तेजः धृतिर्दाक्ष्यं ||</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={clsx(
                                    "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    location.pathname === link.path
                                        ? "text-rose-600 bg-rose-50"
                                        : "text-gray-600 hover:text-rose-600 hover:bg-gray-50"
                                )}
                            >
                                {link.icon && <link.icon className="h-4 w-4" />}
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to={adminLink.path}
                            className={clsx(
                                "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors border",
                                location.pathname.startsWith('/admin')
                                    ? "text-rose-600 border-rose-200 bg-rose-50"
                                    : "text-gray-500 border-gray-200 hover:text-rose-600 hover:border-rose-200"
                            )}
                        >
                            <Lock className="h-4 w-4" />
                            Admin
                        </Link>
                    </div>

                    <div className="flex item-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium",
                                    location.pathname === link.path
                                        ? "text-rose-600 bg-rose-50"
                                        : "text-gray-600 hover:text-rose-600 hover:bg-gray-50"
                                )}
                            >
                                {link.icon && <link.icon className="h-4 w-4" />}
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to={adminLink.path}
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                                "flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium",
                                location.pathname.startsWith('/admin')
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-gray-600 hover:text-rose-600 hover:bg-gray-50"
                            )}
                        >
                            <Lock className="h-4 w-4" />
                            Admin
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
