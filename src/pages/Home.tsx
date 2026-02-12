import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Users, Heart, Search, ChevronRight, Bell } from 'lucide-react';
import type { SocietyUpdate } from '../types';

export default function Home() {
    const [updates, setUpdates] = useState<SocietyUpdate[]>([]);

    useEffect(() => {
        const fetchUpdates = async () => {
            const { data } = await supabase
                .from('society_updates')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) setUpdates(data);
        };
        fetchUpdates();
    }, []);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative bg-rose-50 rounded-3xl overflow-hidden py-16 px-4 sm:px-6 lg:px-8 text-center lg:text-left">
                <div className="lg:flex items-center justify-between gap-12">
                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                            Connect within <br />
                            <span className="text-rose-600">Lodha Samaj</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                            The official matrimony portal for our community. Find your perfect life partner with trust and tradition.
                            (लोधा समाज का विश्वसनीय वैवाहिक मंच)
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/profiles" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 md:text-lg transition-transform hover:scale-105">
                                <Search className="w-5 h-5 mr-2" />
                                Browse Profiles
                            </Link>
                            <Link to="/submit" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-transform hover:scale-105">
                                <Heart className="w-5 h-5 mr-2" />
                                Create Profile
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:block lg:w-1/2 flex justify-center">
                        <img
                            src="/hero-couple.png"
                            alt="Happy Couple"
                            className="max-h-[500px] w-auto object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                        />
                        <p className="text-center text-rose-800 font-bold mt-4 text-xl tracking-wide">
                            || शौर्यं तेजः धृतिर्दाक्ष्यं ||
                        </p>
                    </div>
                </div>
            </section>

            {/* Society Updates Section */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <Bell className="h-6 w-6 text-rose-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Society Updates (समाज सूचना)</h2>
                </div>

                {updates.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                        No recent updates posted.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {updates.map(update => (
                            <div key={update.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                                    {new Date(update.created_at).toLocaleDateString()}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{update.title}</h3>
                                <p className="text-gray-600 line-clamp-3">{update.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8 text-center max-w-7xl mx-auto px-4">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors">
                    <div className="w-12 h-12 mx-auto bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Profiles</h3>
                    <p className="text-gray-600">All profiles are manually screened by our admin team to ensure safety and authenticity.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors">
                    <div className="w-12 h-12 mx-auto bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Matching</h3>
                    <p className="text-gray-600">Filter by Age, Gotra, and Income to find compatible life partners within the community.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors">
                    <div className="w-12 h-12 mx-auto bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Search</h3>
                    <p className="text-gray-600">Simple and intuitive search tools designed for everyone in the family to use.</p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 rounded-3xl py-16 px-4 text-center text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold">Ready to find your soulmate?</h2>
                    <p className="text-gray-300 text-lg">Join hundreds of happy couples from the Lodha Samaj who found their partner here.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/submit" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 transition-colors">
                            Register Now
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/samaj-connect" className="inline-flex items-center px-8 py-3 border border-gray-500 text-base font-medium rounded-md text-white hover:bg-gray-800 transition-colors">
                            Join Samaj
                        </Link>
                    </div>
                </div>
            </section>

            {/* Foundation & Contact Section */}
            <section className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 pb-12">
                <div className="bg-rose-50 p-8 rounded-2xl space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 border-b border-rose-200 pb-2">Connect With Us!</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="text-xl">📧</span> Mail
                            </h3>
                            <a href="mailto:lodhasamajshikshafoundation@gmail.com" className="text-rose-700 hover:underline break-all">
                                lodhasamajshikshafoundation@gmail.com
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="text-xl">📍</span> Location
                            </h3>
                            <p className="text-gray-600">
                                18-20, Swapnil farm, Mirjapur, Tejaji nagar bypass, Indore, M.P. 452020.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="text-xl">🌐</span> Lodha Samaj Shikhsa Foundation
                            </h3>
                            <a href="https://lodhasamajshikshafoundation.netlify.app/" target="_blank" rel="noreferrer" className="block mb-2 text-rose-700 hover:underline break-all">
                                https://lodhasamajshikshafoundation.netlify.app/
                            </a>
                            <img src="/foundation-logo.png" alt="Lodha Samaj Shiksha Foundation Logo" className="h-24 w-auto object-contain mt-2" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="text-xl">📄</span> Reports/Lists
                            </h3>
                            <p className="text-gray-600">
                                Detailed lists of our Members, Donors, and Volunteers.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Contact Us</h2>
                    <p className="text-sm text-gray-500">Founder & Office Bearers of Lodha Samaj Shiksha Foundation</p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-rose-100 p-3 rounded-full text-rose-600 font-bold text-xl">R</div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Ramgopal Lawvanshi</h3>
                                <p className="text-rose-600 font-medium">Founder / President (अध्यक्ष/संस्थापक)</p>
                                <a href="tel:+919893768188" className="text-gray-600 hover:text-gray-900 block mt-1">📞 +91 98937 68188</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 font-bold text-xl">S</div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Sunil Sadh</h3>
                                <p className="text-blue-600 font-medium">Secretary (सचिव)</p>
                                <a href="tel:+919977994298" className="text-gray-600 hover:text-gray-900 block mt-1">📞 +91 99779 94298</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-full text-green-600 font-bold text-xl">R</div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Ramswaroop Shastri</h3>
                                <p className="text-green-600 font-medium">Treasurer (कोषाध्यक्ष)</p>
                                <a href="tel:+917999980988" className="text-gray-600 hover:text-gray-900 block mt-1">📞 +91 79999 80988</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
