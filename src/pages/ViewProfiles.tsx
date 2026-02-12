import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Profile } from '../types';
import ProfileCard from '../components/ProfileCard';
import { Loader2, Search, Filter, X } from 'lucide-react';

export default function ViewProfiles() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [activeTab, setActiveTab] = useState<'Female' | 'Male'>('Male');
    const [minAge, setMinAge] = useState<string>('');
    const [maxAge, setMaxAge] = useState<string>('');
    const [minIncome, setMinIncome] = useState<string>(''); // Matches income_lakh
    const [gotraFilter, setGotraFilter] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        fetchProfiles();
    }, [activeTab, sortOrder]);

    const fetchProfiles = async () => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from('profiles')
                .select('*')
                .eq('status', 'approved')
                .eq('gender', activeTab);

            if (sortOrder === 'asc') {
                query = query.order('age', { ascending: true });
            } else {
                query = query.order('age', { ascending: false });
            }

            const { data, error } = await query;

            if (error) throw error;
            setProfiles(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredProfiles = profiles.filter(profile => {
        if (minAge && profile.age < parseInt(minAge)) return false;
        if (maxAge && profile.age > parseInt(maxAge)) return false;
        // V3: Compare with income_lakh
        if (minIncome && (!profile.income_lakh || profile.income_lakh < parseFloat(minIncome))) return false;
        if (gotraFilter && !profile.family_gotra?.toLowerCase().includes(gotraFilter.toLowerCase())) return false;
        return true;
    });

    const clearFilters = () => {
        setMinAge('');
        setMaxAge('');
        setMinIncome('');
        setGotraFilter('');
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Find Your Match</h2>
                <p className="text-gray-600">Browse profiles from the {activeTab === 'Male' ? 'Purush (Male)' : 'Stree (Female)'} section</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('Male')}
                        className={`${activeTab === 'Male' ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                    >
                        Purush (Male)
                    </button>
                    <button
                        onClick={() => setActiveTab('Female')}
                        className={`${activeTab === 'Female' ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                    >
                        Stree (Female)
                    </button>
                </nav>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="lg:w-1/4 space-y-6 h-fit top-4 sticky">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-gray-900 pb-2 border-b">
                            <Filter className="h-4 w-4" /> Filters
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Age Range</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input type="number" placeholder="Min" value={minAge} onChange={(e) => setMinAge(e.target.value)} className="w-full text-sm border-gray-300 rounded-md p-2 border" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="Max" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} className="w-full text-sm border-gray-300 rounded-md p-2 border" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Family Gotra</label>
                            <input type="text" placeholder="Search Gotra..." value={gotraFilter} onChange={(e) => setGotraFilter(e.target.value)} className="mt-1 w-full text-sm border-gray-300 rounded-md p-2 border" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Min Annual Income (Lakh)</label>
                            <input type="number" placeholder="e.g. 5.5" step="0.5" value={minIncome} onChange={(e) => setMinIncome(e.target.value)} className="mt-1 w-full text-sm border-gray-300 rounded-md p-2 border" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Sort By Age</label>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} className="mt-1 w-full text-sm border-gray-300 rounded-md p-2 border">
                                <option value="asc">Youngest First</option>
                                <option value="desc">Oldest First</option>
                            </select>
                        </div>

                        <button onClick={clearFilters} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                            <X className="h-4 w-4" /> Clear All Filters
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="lg:w-3/4">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-rose-600" /></div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg">{error}</div>
                    ) : filteredProfiles.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900">No profiles found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProfiles.map((profile) => (
                                <ProfileCard key={profile.id} profile={profile} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
