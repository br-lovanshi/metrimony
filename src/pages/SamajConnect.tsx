import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader2, CheckCircle, Handshake } from 'lucide-react';

export default function SamajConnect() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        mobile: '',
        email: '',
        address: '',
        state: '',
        district: '',
        block_tehsil: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('samaj_connect_requests')
                .insert([
                    {
                        ...formData,
                        age: parseInt(formData.age),
                        status: 'pending'
                    }
                ]);

            if (error) throw error;
            setSuccess(true);
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 px-4">
                <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Request Sent Successfully!</h2>
                <p className="text-gray-600">
                    Thank you for connecting with the Samaj Foundation. Our team will contact you shortly.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-4 text-rose-600">
                    <Handshake className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Samaj Foundation Connect</h1>
                <p className="text-lg text-gray-600">
                    Join hands with the society. Fill this form to connect with us for welfare and social initiatives.
                </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name (पूरा नाम)</label>
                            <input type="text" name="full_name" required className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age (उम्र)</label>
                            <input type="number" name="age" required className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number (मोबाइल)</label>
                            <input type="tel" name="mobile" required className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email ID (ईमेल)</label>
                            <input type="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Address (पूरा पता)</label>
                        <textarea name="address" required rows={3} className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange}></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State (राज्य)</label>
                            <input type="text" name="state" required className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">District (जिला)</label>
                            <input type="text" name="district" required className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Block / Tehsil (तहसील)</label>
                            <input type="text" name="block_tehsil" required className="mt-1 block w-full rounded-md border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-rose-700 transition-colors disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : "Submit Request (अनुरोध भेजें)"}
                    </button>
                </form>
            </div>
        </div>
    );
}
