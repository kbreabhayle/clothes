"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Upload, Save, Trash2, Package, Tag, DollarSign, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductEditor({ product = null, onSave, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        stock_quantity: product?.stock_quantity || 0,
        category_id: product?.category_id || '',
        image_url: product?.image_url || '',
        status: product?.status || 'active'
    });

    useEffect(() => {
        async function fetchCats() {
            const { data } = await supabase.from('categories').select('*');
            setCategories(data || []);
            // Auto-select first category if empty and creating new
            if (!formData.category_id && data?.length > 0) {
                setFormData(prev => ({ ...prev, category_id: data[0].id }));
            }
        }
        fetchCats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (product?.id) {
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', product.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([formData]);
                if (error) throw error;
            }
            onSave();
        } catch (error) {
            console.error('Save Error:', error);
            alert('Operation Failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-4xl w-full bg-[#0a0a0a] border border-white/10 rounded-smooth overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-white">
                            {product ? 'Modify Resource' : 'Register Manifest'}
                        </h2>
                        <p className="text-[8px] font-bold tracking-[0.2em] text-white/20 uppercase mt-1">
                            Atelier / Product Inventory Protocol
                        </p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Column 1: Core Specs */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                                    <Package size={10} /> Nomenclature
                                </label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Midnight Velvet Blazer..."
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-sm text-[11px] tracking-widest outline-none focus:border-white transition-all text-white placeholder:text-white/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                                        <DollarSign size={10} /> Valuation
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-5 rounded-sm text-[13px] font-black outline-none focus:border-white transition-all text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                                        <Tag size={10} /> Classification
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-5 rounded-sm text-[10px] font-black tracking-widest outline-none focus:border-white transition-all text-white uppercase appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                                    <Info size={10} /> Product Brief
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-sm text-[11px] tracking-widest outline-none focus:border-white transition-all text-white resize-none"
                                />
                            </div>
                        </div>

                        {/* Column 2: Media & Status */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                                    <Upload size={10} /> Media Asset URL
                                </label>
                                <input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-sm text-[9px] tracking-wider outline-none focus:border-white transition-all text-white font-mono"
                                    placeholder="https://..."
                                />
                                <div className="aspect-[4/5] bg-white/[0.02] border border-dashed border-white/10 rounded-sm overflow-hidden flex items-center justify-center">
                                    {formData.image_url ? (
                                        <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
                                                <Upload size={16} />
                                            </div>
                                            <p className="text-[8px] font-black tracking-widest text-white/20 uppercase">No Manifest Image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-12 pt-4">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="flex-1 border border-white/10 text-white/40 py-5 text-[9px] font-black tracking-[0.3em] uppercase hover:text-white transition-all"
                                >
                                    Terminate
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-white text-black py-5 text-[9px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:tracking-[0.5em] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : <><Save size={14} /> Commit</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
