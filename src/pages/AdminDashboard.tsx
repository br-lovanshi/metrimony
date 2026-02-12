import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Profile, SocietyUpdate, SamajConnectRequest } from '../types';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogOut, Trash2, Check, X, Eye, Bell, Users, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profiles' | 'updates' | 'connect'>('profiles');

    // Data States
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [updates, setUpdates] = useState<SocietyUpdate[]>([]);
    const [connectRequests, setConnectRequests] = useState<SamajConnectRequest[]>([]);

    // Create Update Form
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newUpdate, setNewUpdate] = useState({ title: '', description: '' });

    useEffect(() => {
        checkUser();
        fetchData();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) navigate('/admin/login');
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([
            fetchProfiles(),
            fetchUpdates(),
            fetchConnectRequests()
        ]);
        setLoading(false);
    };

    const fetchProfiles = async () => {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data) setProfiles(data);
    };

    const fetchUpdates = async () => {
        const { data } = await supabase.from('society_updates').select('*').order('created_at', { ascending: false });
        if (data) setUpdates(data);
    };

    const fetchConnectRequests = async () => {
        const { data } = await supabase.from('samaj_connect_requests').select('*').order('created_at', { ascending: false });
        if (data) setConnectRequests(data);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    // Profile Actions
    const updateProfileStatus = async (id: string, status: 'approved' | 'rejected') => {
        await supabase.from('profiles').update({ status }).eq('id', id);
        fetchProfiles();
    };
    const deleteProfile = async (id: string) => {
        if (!confirm('Convert to delete?')) return;
        await supabase.from('profiles').delete().eq('id', id);
        fetchProfiles();
    };

    // Updates Actions
    const createUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('society_updates').insert([{ ...newUpdate, created_by: user?.id }]);
        setNewUpdate({ title: '', description: '' });
        setShowUpdateModal(false);
        fetchUpdates();
    };
    const deleteUpdate = async (id: string) => {
        if (!confirm('Delete this update?')) return;
        await supabase.from('society_updates').delete().eq('id', id);
        fetchUpdates();
    };

    // Connect Actions
    const markContacted = async (id: string) => {
        await supabase.from('samaj_connect_requests').update({ status: 'contacted' }).eq('id', id);
        fetchConnectRequests();
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-rose-600" /></div>;

    const pendingProfiles = profiles.filter(p => p.status === 'pending');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage Lodha Samaj Platform</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    <LogOut className="h-4 w-4" /> Logout
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
                <button onClick={() => setActiveTab('profiles')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'profiles' ? 'bg-white shadow text-rose-600' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Users className="inline h-4 w-4 mr-2" /> Profiles ({pendingProfiles.length})
                </button>
                <button onClick={() => setActiveTab('updates')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'updates' ? 'bg-white shadow text-rose-600' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Bell className="inline h-4 w-4 mr-2" /> Society Updates
                </button>
                <button onClick={() => setActiveTab('connect')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'connect' ? 'bg-white shadow text-rose-600' : 'text-gray-600 hover:text-gray-900'}`}>
                    <FileText className="inline h-4 w-4 mr-2" /> Connect Requests
                </button>
            </div>

            {/* PROFILES TAB */}
            {activeTab === 'profiles' && (
                <div className="space-y-8">
                    <div className="bg-white rounded-lg shadow border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Pending Approvals</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingProfiles.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {p.self_photo_url ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={p.self_photo_url} alt="" />
                                                    ) : <div className="h-10 w-10 rounded-full bg-gray-200" />}
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{p.full_name}</div>
                                                        <div className="text-xs text-gray-500">{p.age} Yrs | {p.gender}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{p.education}</div>
                                                <div className="text-xs text-gray-500">{p.income_lakh ? `${p.income_lakh} L/Yr` : 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                Self: {p.family_gotra}<br />
                                                Father: {p.father_gotra}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/profile/${p.id}`} className="text-gray-600 bg-gray-100 p-2 rounded-full"><Eye className="h-4 w-4" /></Link>
                                                    <button onClick={() => updateProfileStatus(p.id!, 'approved')} className="text-green-600 bg-green-50 p-2 rounded-full"><Check className="h-4 w-4" /></button>
                                                    <button onClick={() => updateProfileStatus(p.id!, 'rejected')} className="text-red-600 bg-red-50 p-2 rounded-full"><X className="h-4 w-4" /></button>
                                                    <button onClick={() => deleteProfile(p.id!)} className="text-gray-400 hover:text-red-600 p-2"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingProfiles.length === 0 && <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No pending profiles.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* UPDATES TAB */}
            {activeTab === 'updates' && (
                <div className="space-y-6">
                    <button onClick={() => setShowUpdateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">
                        <Plus className="h-4 w-4" /> New Update
                    </button>

                    {showUpdateModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-bold mb-4">Post Society Update</h3>
                                <form onSubmit={createUpdate} className="space-y-4">
                                    <input type="text" placeholder="Title" required className="w-full border rounded p-2" value={newUpdate.title} onChange={e => setNewUpdate({ ...newUpdate, title: e.target.value })} />
                                    <textarea placeholder="Description" required rows={4} className="w-full border rounded p-2" value={newUpdate.description} onChange={e => setNewUpdate({ ...newUpdate, description: e.target.value })} />
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowUpdateModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded">Post</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4">
                        {updates.map(u => (
                            <div key={u.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{u.title}</h3>
                                    <p className="text-gray-600 mt-1">{u.description}</p>
                                    <span className="text-xs text-gray-400 mt-2 block">{new Date(u.created_at).toLocaleString()}</span>
                                </div>
                                <button onClick={() => deleteUpdate(u.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                        {updates.length === 0 && <p className="text-gray-500">No updates posted yet.</p>}
                    </div>
                </div>
            )}

            {/* CONNECT REQUESTS TAB */}
            {activeTab === 'connect' && (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {connectRequests.map(r => (
                                <tr key={r.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{r.full_name}</div>
                                        <div className="text-xs text-gray-500">Age: {r.age}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div>{r.mobile}</div>
                                        <div className="text-gray-500">{r.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div>{r.district}, {r.state}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {r.status === 'pending' ? (
                                            <button onClick={() => markContacted(r.id)} className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                                                Mark Contacted
                                            </button>
                                        ) : (
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Contacted</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {connectRequests.length === 0 && <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No requests found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
