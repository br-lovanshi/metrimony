import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import type { Profile } from '../types';
import { Loader2, ArrowLeft, User, Phone, MapPin, Briefcase, GraduationCap, Users, Heart, Eye, IndianRupee } from 'lucide-react';

export default function ProfileDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMobile, setShowMobile] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        if (!id) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const maskMobile = (mobile: string) => {
        if (!mobile || mobile.length < 5) return mobile;
        return mobile.substring(0, 2) + 'XXXX' + mobile.substring(mobile.length - 4);
    };

    const formatIncome = (lakhs: number | undefined) => {
        if (lakhs === undefined || lakhs === null) return 'N/A';
        return `${lakhs} Lakh/Year`;
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-rose-600" /></div>;
    if (!profile) return <div className="text-center py-20">Profile not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profiles
            </button>

            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3 bg-gray-100 relative min-h-[350px]">
                        {profile.self_photo_url ? (
                            <img src={profile.self_photo_url} alt={profile.full_name} className="w-full h-full object-cover absolute inset-0" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200"><User className="h-24 w-24" /></div>
                        )}
                    </div>
                    <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                                <p className="text-lg text-rose-600 font-medium mt-1">{profile.age} Years • {profile.height_inch} Inches</p>
                            </div>
                            <div className="flex gap-2">
                                {profile.manglik && <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-bold uppercase">Manglik</span>}
                                {profile.rashifal_symbol && <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold uppercase">{profile.rashifal_symbol}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                    <span className="font-medium">{profile.occupation || 'Not Specified'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <IndianRupee className="h-5 w-5 text-gray-400" />
                                    <span>{formatIncome(profile.income_lakh)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                    <span>{profile.education}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                    <span>{profile.address}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="h-5 w-5 text-gray-400" />
                                    <span>Self Gotra: <span className="font-semibold text-gray-900">{profile.family_gotra}</span></span>
                                </div>
                                {profile.father_gotra && (
                                    <div className="flex items-center gap-2 text-gray-600 ml-7">
                                        <span className="text-xs">Father Gotra: {profile.father_gotra}</span>
                                    </div>
                                )}
                                {profile.mother_gotra && (
                                    <div className="flex items-center gap-2 text-gray-600 ml-7">
                                        <span className="text-xs">Mother Gotra: {profile.mother_gotra}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left: Contact & Family */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="h-5 w-5 text-rose-600" /> Contact Info
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase mb-1">Mobile</p>
                                <div className="flex items-center justify-between">
                                    <p className="font-mono font-bold text-lg text-gray-800">
                                        {showMobile ? profile.mobile : maskMobile(profile.mobile)}
                                    </p>
                                    <button onClick={() => setShowMobile(!showMobile)} className="text-rose-600 hover:text-rose-700">
                                        <Eye className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Email</p>
                                <p className="font-medium break-all">{profile.email}</p>
                            </div>
                            {profile.social_media_link && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Social Media</p>
                                    <a href={profile.social_media_link} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">
                                        View Profile
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-rose-600" /> Family info
                        </h3>
                        <div className="space-y-3 text-sm">
                            <p><span className="text-gray-500">Father:</span> {profile.father_name}</p>
                            {profile.father_occupation && <p><span className="text-gray-500">Father's Job:</span> {profile.father_occupation}</p>}
                            {/* Mother Name isn't in schema, only Gotra/Occupation were requested additions, but good to have if needed */}
                            {profile.mother_occupation && <p><span className="text-gray-500">Mother's Job:</span> {profile.mother_occupation}</p>}
                            <div className="pt-2 border-t mt-2">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Gotra Details:</p>
                                <p>Father: {profile.father_gotra}</p>
                                <p>Mother: {profile.mother_gotra}</p>
                            </div>
                            {profile.siblings_details && (
                                <div className="pt-2 border-t mt-2">
                                    <p className="text-gray-500 mb-1">Siblings:</p>
                                    <p>{profile.siblings_details}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Bio & Family Photo */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Heart className="h-5 w-5 text-rose-600" /> Expectations & Bio
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-600">
                            <p className="whitespace-pre-wrap">{profile.expectations}</p>

                            {profile.hobbies && (
                                <div className="mt-4 pt-4 border-t">
                                    <span className="font-semibold text-gray-900">Hobbies:</span> {profile.hobbies}
                                </div>
                            )}
                        </div>
                    </div>

                    {profile.family_photo_url && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Family Photo</h3>
                            <div className="rounded-lg overflow-hidden bg-gray-100 flex justify-center">
                                <img src={profile.family_photo_url} alt="Family" className="w-auto h-auto max-h-[500px] object-contain" />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
