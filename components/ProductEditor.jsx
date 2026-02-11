"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Box, Tag, DollarSign, Image as ImageIcon, CheckCircle, Info, Trash2, Plus, Sparkles, Edit, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

export default function ProductEditor({ product, onSave, onCancel }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image_url: '',
        status: 'active',
        stock: 0
    });
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('essential'); // 'essential' or 'creative'

    useEffect(() => {
        fetchCategories();
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                category_id: product.category_id || '',
                description: product.description || '',
                image_url: product.image_url || '',
                status: product.status || 'active',
                stock: product.stock || 0
            });
        }
    }, [product]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        setCategories(data || []);
    };

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
            console.error('Save failed:', error);
            alert('Save failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('vault')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('vault')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
                onClick={onCancel}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background border border-foreground/10 rounded-smooth shadow-luxury scrollbar-hide relative z-[101] transition-colors duration-500"
            >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-foreground/5 flex justify-between items-center sticky top-0 bg-background/90 backdrop-blur-md z-10 transition-colors duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center shadow-luxury">
                            {product ? <Edit size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground">
                                {product ? 'Update Manifest' : 'Register Resource'}
                            </h2>
                            <p className="text-[8px] font-bold tracking-[0.2em] text-foreground/30 uppercase mt-1">Atelier Resource Database</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-12 transition-colors duration-500">
                    {/* Mode Toggle */}
                    <div className="flex border-b border-foreground/5 pb-8 overflow-x-auto no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setActiveTab('essential')}
                            className={`px-8 py-2 text-[9px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'essential' ? 'text-foreground' : 'text-foreground/20 hover:text-foreground/40'}`}
                        >
                            Essential Specs
                            {activeTab === 'essential' && <motion.div layoutId="tab-underline" className="h-0.5 bg-foreground mt-2" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('creative')}
                            className={`px-8 py-2 text-[9px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'creative' ? 'text-foreground' : 'text-foreground/20 hover:text-foreground/40'}`}
                        >
                            Creative Identity
                            {activeTab === 'creative' && <motion.div layoutId="tab-underline" className="h-0.5 bg-foreground mt-2" />}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'essential' ? (
                            <motion.div
                                key="essential"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                            >
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase flex items-center gap-2">
                                        <Tag size={10} /> Designation
                                    </label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-foreground/5 border border-foreground/10 p-5 rounded-sm text-[11px] tracking-widest outline-none focus:border-accent transition-all text-foreground placeholder:text-foreground/10"
                                        placeholder="RESOURCE NAME..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase flex items-center gap-2">
                                        <DollarSign size={10} /> Valuation (USD)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-foreground/5 border border-foreground/10 p-5 rounded-sm text-[11px] font-black tracking-widest outline-none focus:border-accent transition-all text-foreground"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase flex items-center gap-2">
                                        <Box size={10} /> Classification
                                    </label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full bg-foreground/5 border border-foreground/10 p-5 rounded-sm text-[10px] font-black tracking-widest outline-none focus:border-accent transition-all text-foreground uppercase appearance-none"
                                        >
                                            <option value="">Select Domain</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id} className="bg-background text-foreground">{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase flex items-center gap-2">
                                        <Info size={10} /> Operational State
                                    </label>
                                    <div className="flex gap-4">
                                        {['active', 'archived'].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status })}
                                                className={`flex-1 py-4 text-[9px] font-black tracking-widest uppercase border rounded-sm transition-all ${formData.status === status ? 'bg-foreground text-background border-foreground' : 'bg-transparent border-foreground/10 text-foreground/40 hover:border-foreground/30'}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="creative"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-12"
                            >
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase flex items-center gap-2">
                                        <ImageIcon size={10} /> Visual Signature
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div
                                                onClick={() => document.getElementById('image-upload').click()}
                                                className="aspect-video bg-foreground/5 border border-foreground/10 border-dashed rounded-smooth flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-foreground/10 transition-all group overflow-hidden relative"
                                            >
                                                {formData.image_url ? (
                                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <ImageIcon size={24} className="text-foreground/20 group-hover:scale-110 transition-transform" />
                                                        <span className="text-[8px] font-black tracking-widest text-foreground/40">Transmit Image Data</span>
                                                    </>
                                                )}
                                                <input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                            </div>
                                            <p className="text-[7px] font-black tracking-widest text-foreground/20 uppercase text-center">Supported: JPG, PNG, WEBP (MAX 5MB)</p>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[8px] font-black tracking-[0.2em] text-foreground/40 uppercase leading-relaxed italic border-l border-foreground/10 pl-4 py-2">
                                                Visual data should minimize noise and maximize product clarity for the Atelier interface. 4:5 aspect ratio recommended.
                                            </p>
                                            <input
                                                value={formData.image_url}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 p-5 rounded-sm text-[10px] tracking-widest outline-none focus:border-accent transition-all text-foreground placeholder:text-foreground/10"
                                                placeholder="OR INPUT EXTERNAL URL..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase flex items-center gap-2">
                                        <Sparkles size={10} /> Aesthetic Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-foreground/5 border border-foreground/10 p-5 rounded-sm text-[11px] tracking-widest outline-none focus:border-accent transition-all text-foreground placeholder:text-foreground/10 resize-none"
                                        placeholder="DEFINE COLOR, TEXTURE, AND FEEL..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row justify-end gap-4 md:gap-6 pt-8 border-t border-foreground/5">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full md:w-auto px-10 py-5 text-[9px] font-black tracking-[0.3em] uppercase text-foreground/40 hover:text-foreground transition-all"
                        >
                            Abort Changes
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full md:w-auto bg-foreground text-background px-12 py-5 text-[9px] font-black tracking-[0.4em] uppercase flex items-center justify-center gap-4 hover:tracking-[0.6em] transition-all duration-700 shadow-luxury disabled:opacity-50"
                        >
                            {loading ? <RefreshCcw size={14} className="animate-spin" /> : (
                                <>
                                    Commit Resource <Save size={14} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
