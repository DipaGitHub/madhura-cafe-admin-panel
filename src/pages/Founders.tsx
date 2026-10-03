import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from "@/components/layout/AdminLayout";
import { Star, Loader2, PlusCircle, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';
import { apiUrl, imageUrl } from "@/config/api";

const BASE_URL = apiUrl("/api/founders");

interface FounderData {
    id: number;
    name: string;
    designation: string | null;
    description: string | null;
    image_url: string | null;
    image_quote: string | null;
    contact_info: string | null;
    is_active: boolean;
    display_order: number | null;
}

interface FounderFormProps {
    initialData: FounderData | null;
    onClose: () => void;
    onSuccess: () => void;
}

const FounderForm: React.FC<FounderFormProps> = ({ initialData, onClose, onSuccess }) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState<Omit<FounderData, 'id'>>({
        name: initialData?.name || '',
        designation: initialData?.designation || '',
        description: initialData?.description || '',
        image_quote: initialData?.image_quote || '',
        contact_info: initialData?.contact_info || '',
        image_url: initialData?.image_url || null,
        is_active: initialData?.is_active ?? true,
        display_order: initialData?.display_order || null,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const endpoint = isEdit ? `${BASE_URL}/${initialData!.id}` : `${BASE_URL}`;
            const method = isEdit ? 'PUT' : 'POST';

            const formDataPayload = new FormData();
            formDataPayload.append('name', formData.name);
            formDataPayload.append('designation', formData.designation || '');
            formDataPayload.append('description', formData.description || '');
            formDataPayload.append('image_quote', formData.image_quote || '');
            formDataPayload.append('contact_info', formData.contact_info || '');
            formDataPayload.append('is_active', String(formData.is_active));
            formDataPayload.append('display_order', String(formData.display_order || ''));

            if (imageFile) {
                formDataPayload.append('image', imageFile);
            }

            const response = await fetch(endpoint, {
                method: method,
                body: formDataPayload,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `HTTP error! Status: ${response.status}`);
            }

            onSuccess();
            onClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to save founder: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-xl font-semibold text-gray-800">{isEdit ? 'Edit Founder' : 'Add Founder'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition"><X size={24} /></button>
                </div>
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Name *</span>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2 border" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Designation</span>
                            <input type="text" name="designation" value={formData.designation || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2 border" />
                        </label>
                        <label className="block col-span-2">
                            <span className="text-sm font-medium text-gray-700">Description</span>
                            <textarea name="description" rows={4} value={formData.description || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2 border resize-none"></textarea>
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Image Quote (Overlay)</span>
                            <input type="text" name="image_quote" value={formData.image_quote || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2 border" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Contact Info (Phone/Email)</span>
                            <input type="text" name="contact_info" value={formData.contact_info || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2 border" />
                        </label>
                    </div>

                    <div className="border p-4 rounded-lg space-y-3">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-600">Upload Image</span>
                            <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 border p-2" />
                        </label>
                        {isEdit && initialData?.image_url && !imageFile && (
                            <div className="text-sm text-gray-500">Current Image: {initialData.image_url.split('/').pop()}</div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Display Order</span>
                            <input type="number" name="display_order" value={formData.display_order || ''} onChange={handleNumberChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2 border" />
                        </label>
                        <label className="flex items-center space-x-2 mt-6">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50 h-5 w-5" />
                            <span className="text-sm font-medium text-gray-700">Is Active</span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center">
                            {loading && <Loader2 size={16} className="mr-2 animate-spin" />} Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Founders() {
    const [founders, setFounders] = useState<FounderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFounder, setEditingFounder] = useState<FounderData | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const fetchFounders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(BASE_URL);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const result = await res.json();
            if (result.success) {
                setFounders(result.data);
            } else {
                setError(result.message || 'Failed to load founders');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchFounders(); }, [fetchFounders]);

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            fetchFounders();
        } catch (err) {
            console.error(err);
            alert('Failed to delete founder');
        } finally {
            setDeleteConfirmId(null);
        }
    };

    const handleEdit = (founder: FounderData) => {
        setEditingFounder(founder);
        setIsFormOpen(true);
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Founders</h1>
                        <p className="text-gray-500 mt-1">Manage the Meet Our Founders section.</p>
                    </div>
                    <button onClick={() => { setEditingFounder(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                        <PlusCircle size={20} /> Add Founder
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                        <AlertTriangle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                        <div><h3 className="text-red-800 font-medium">Error loading data</h3><p className="text-red-700 text-sm mt-1">{error}</p></div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20"><Loader2 size={40} className="text-indigo-500 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {founders.map((founder) => (
                            <div key={founder.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm relative group flex flex-col md:flex-row gap-4">
                                {founder.image_url ? (
                                    <div className="w-full md:w-32 h-32 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img src={imageUrl(founder.image_url)} alt={founder.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full md:w-32 h-32 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-300 flex-shrink-0"><Star size={32} /></div>
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg text-gray-900">{founder.name}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${founder.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {founder.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-indigo-600 font-medium mt-1">{founder.designation}</p>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{founder.description}</p>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-1 flex gap-1">
                                    <button onClick={() => handleEdit(founder)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit"><Edit2 size={16} /></button>
                                    <button onClick={() => setDeleteConfirmId(founder.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete"><Trash2 size={16} /></button>
                                </div>
                                {deleteConfirmId === founder.id && (
                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 z-10 border border-red-200">
                                        <AlertTriangle size={32} className="text-red-500 mb-3" />
                                        <p className="text-gray-900 font-medium mb-4 text-center">Delete {founder.name}?</p>
                                        <div className="flex gap-3">
                                            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
                                            <button onClick={() => handleDelete(founder.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Confirm Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {founders.length === 0 && (
                            <div className="col-span-full py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                                <p className="text-gray-500">No founders found. Add one to get started.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isFormOpen && <FounderForm initialData={editingFounder} onClose={() => { setIsFormOpen(false); setEditingFounder(null); }} onSuccess={fetchFounders} />}
        </AdminLayout>
    );
}
