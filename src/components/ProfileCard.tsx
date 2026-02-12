import { Link } from 'react-router-dom';
import type { Profile } from '../types';
import { MapPin, Briefcase, GraduationCap, User, IndianRupee } from 'lucide-react';

interface ProfileCardProps {
    profile: Profile;
    isAdmin?: boolean;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function ProfileCard({ profile, isAdmin, onApprove, onReject, onDelete }: ProfileCardProps) {

    const formatIncome = (lakhs: number | undefined) => {
        if (lakhs === undefined || lakhs === null) return 'N/A';
        return `${lakhs} Lakh/Year`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative">
            <Link to={`/profile/${profile.id}`} className="block h-64 overflow-hidden bg-gray-100 relative group">
                {profile.self_photo_url ? (
                    <img
                        src={profile.self_photo_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                        <User className="h-20 w-20" />
                    </div>
                )}
                <div className="absolute top-0 right-0 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {profile.age} Yrs
                </div>
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full p-3 pt-8">
                    <p className="text-white text-sm font-medium">{profile.full_name}</p>
                </div>
            </Link>

            <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-gray-900">{profile.family_gotra}</h3>
                    <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                        {profile.rashifal_symbol || 'N/A'}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{profile.education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{profile.occupation || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{formatIncome(profile.income_lakh)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{profile.address}</span>
                    </div>
                </div>

                {isAdmin ? (
                    <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                        {profile.status === 'pending' && (
                            <>
                                <button onClick={() => onApprove?.(profile.id!)} className="px-2 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded text-xs font-bold">
                                    Approve
                                </button>
                                <button onClick={() => onReject?.(profile.id!)} className="px-2 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-bold">
                                    Reject
                                </button>
                            </>
                        )}
                        <button onClick={() => onDelete?.(profile.id!)} className="col-span-2 px-2 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded text-xs font-bold">
                            Delete
                        </button>
                    </div>
                ) : (
                    <Link to={`/profile/${profile.id}`} className="mt-2 block w-full text-center py-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 text-sm font-semibold transition-colors">
                        View Full Profile
                    </Link>
                )}
            </div>
        </div>
    );
}
