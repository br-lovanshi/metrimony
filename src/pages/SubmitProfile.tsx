import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, CheckCircle, User, Users, MapPin, Briefcase, Heart, Star } from 'lucide-react';

export default function SubmitProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        gender: 'Male',
        rashifal_symbol: '',
        education: '',
        height_inch: '',
        manglik: false,
        blood_group: '',
        father_name: '',
        father_gotra: '',
        mother_gotra: '',
        family_gotra: '',
        address: '',
        mobile: '',
        email: '',
        social_media_link: '',
        expectations: '',
        occupation: '',
        work_experience: '',
        income_lakh: '',
        hobbies: '',
        father_occupation: '',
        mother_occupation: '',
        siblings_details: '',
    });

    const [selfPhoto, setSelfPhoto] = useState<File | null>(null);
    const [familyPhoto, setFamilyPhoto] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'self' | 'family') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'self') setSelfPhoto(e.target.files[0]);
            else setFamilyPhoto(e.target.files[0]);
        }
    };

    const uploadFile = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic Validation
        if (!formData.mobile.match(/^[0-9]{10}$/)) {
            setError("Invalid Mobile Number (अमान्य मोबाइल नंबर). Please enter 10 digits.");
            setLoading(false);
            return;
        }

        try {
            let selfPhotoUrl = '';
            let familyPhotoUrl = '';

            if (selfPhoto) selfPhotoUrl = await uploadFile(selfPhoto);
            if (familyPhoto) familyPhotoUrl = await uploadFile(familyPhoto);

            const { error: insertError } = await supabase
                .from('profiles') // Ensure your table supports the new columns
                .insert([
                    {
                        full_name: formData.full_name,
                        age: parseInt(formData.age),
                        gender: formData.gender,
                        rashifal_symbol: formData.rashifal_symbol,
                        education: formData.education,
                        height_inch: parseInt(formData.height_inch),
                        manglik: formData.manglik,
                        blood_group: formData.blood_group,
                        father_name: formData.father_name,
                        father_gotra: formData.father_gotra,
                        mother_gotra: formData.mother_gotra,
                        family_gotra: formData.family_gotra, // Self Gotra
                        address: formData.address,
                        mobile: formData.mobile,
                        email: formData.email,
                        social_media_link: formData.social_media_link,
                        self_photo_url: selfPhotoUrl,
                        family_photo_url: familyPhotoUrl,
                        expectations: formData.expectations,
                        occupation: formData.occupation,
                        work_experience: formData.work_experience,
                        income_lakh: formData.income_lakh ? parseFloat(formData.income_lakh) : null,
                        hobbies: formData.hobbies,
                        father_occupation: formData.father_occupation,
                        mother_occupation: formData.mother_occupation,
                        siblings_details: formData.siblings_details,
                        status: 'pending',
                    },
                ]);

            if (insertError) throw insertError;

            setSuccess(true);
            window.scrollTo(0, 0);

        } catch (err: any) {
            console.error("Submission Error:", err);
            setError(err.message || 'An error occurred while submitting your profile.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Profile Submitted Successfully!<br />(प्रोफाइल सफलतापूर्वक जमा हो गया!)</h2>
                <p className="text-gray-500">
                    Your profile is now pending approval from the admin.
                </p>
                <div className="pt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-8 text-center border-b pb-6">
                <h2 className="text-3xl font-bold text-gray-900">Create Profile (प्रोफाइल बनाएं)</h2>
                <p className="text-gray-500 mt-2">Find your perfect match in Lodha Samaj.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Personal Details */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
                        <User className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Personal Details (व्यक्तिगत विवरण)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name (पूरा नाम) *</label>
                            <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age (उम्र) *</label>
                            <input type="number" name="age" required min="18" max="99" value={formData.age} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender (लिंग) *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500">
                                <option value="Male">Male (पुरुष)</option>
                                <option value="Female">Female (स्त्री)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rashifal Symbol (राशि) *</label>
                            <input type="text" name="rashifal_symbol" placeholder="e.g. Mesh, Vrishabh..." required value={formData.rashifal_symbol} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Height (इंच में लंबाई) *</label>
                            <input type="number" name="height_inch" placeholder="e.g. 65 (for 5'5'')" required value={formData.height_inch} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div className="flex items-center h-full pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="manglik" checked={formData.manglik} onChange={() => setFormData(prev => ({ ...prev, manglik: !prev.manglik }))} className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4" />
                                <span className="text-sm font-medium text-gray-700">Manglik (मांगलिक)?</span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Family Details */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
                        <Users className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Family & Gotra Details (परिवार और गोत्र)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Father's Name (पिता का नाम) *</label>
                            <input type="text" name="father_name" required value={formData.father_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Self/Family Gotra (स्वयं का गोत्र) *</label>
                            <input type="text" name="family_gotra" required value={formData.family_gotra} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Father's Gotra (पिता का गोत्र) *</label>
                            <input type="text" name="father_gotra" required value={formData.father_gotra} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mother's Gotra (माता का गोत्र) *</label>
                            <input type="text" name="mother_gotra" required value={formData.mother_gotra} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Father's Occupation (पिता का पेशा)</label>
                            <input type="text" name="father_occupation" value={formData.father_occupation} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mother's Occupation (माता का पेशा)</label>
                            <input type="text" name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Siblings Details (भाई-बहन का विवरण)</label>
                        <textarea name="siblings_details" rows={2} value={formData.siblings_details} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" placeholder="Number of brothers and sisters..." />
                    </div>
                </section>

                {/* Education & Career */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
                        <Briefcase className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Education & Career (शिक्षा और पेशा)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Education (शिक्षा) *</label>
                            <input type="text" name="education" required value={formData.education} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Occupation (पेशा)</label>
                            <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Annual Income in Lakh (वार्षिक आय लाख में)</label>
                            <input
                                type="number"
                                name="income_lakh"
                                step="0.1"
                                placeholder="e.g. 5.5, 12, 1.5"
                                value={formData.income_lakh}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter numbers only (decimal allowed)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Work Experience (कार्य अनुभव)</label>
                            <input type="text" name="work_experience" value={formData.work_experience} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                    </div>
                </section>

                {/* Contact Details */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
                        <MapPin className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Contact & Address (संपर्क और पता)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Full Address (पूरा पता) *</label>
                            <textarea name="address" required rows={2} value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number (मोबाइल) *</label>
                            <input type="tel" name="mobile" required placeholder="10 digit number" value={formData.mobile} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email ID (ईमेल) *</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Social Media Link (सोशल मीडिया लिंक)</label>
                            <input type="text" name="social_media_link" placeholder="Instagram/Facebook URL" value={formData.social_media_link} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                        </div>
                    </div>
                </section>

                {/* Additional Details */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
                        <Heart className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Additional Details (अन्य विवरण)</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expectations (अपेक्षाएं/पार्टनर कैसा हो?) *</label>
                        <textarea name="expectations" required rows={3} value={formData.expectations} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" placeholder="Describe what kind of life partner you are looking for..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hobbies (शौक)</label>
                        <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                    </div>
                </section>

                {/* Photos */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
                        <Upload className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Photos (तस्वीरें)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Self Photo (खुद की फोटो)</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'self')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                            <p className="text-xs text-gray-500 mt-1">Clear photo, face visible.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Family Photo (परिवार की फोटो)</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'family')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                            <p className="text-xs text-gray-500 mt-1">Optional but recommended.</p>
                        </div>
                    </div>
                </section>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-6 w-6" />
                                Submitting Profile...
                            </>
                        ) : (
                            'Submit Profile (जमा करें)'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
