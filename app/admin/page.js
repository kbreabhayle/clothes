"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Package, Truck, CheckCircle, XCircle, RefreshCcw, Search, Eye, ArrowRight, Plus, Box, List, Edit, Trash2, Sun, Moon, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/AdminLogin';
import ProductEditor from '@/components/ProductEditor';
import { useTheme } from '@/context/ThemeContext';

export default function AdminDashboard() {
    const { theme, setThemeExplicit } = useTheme();
    const [view, setView] = useState('orders'); // 'orders' or 'products'
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        setOrders(data || []);
        setLoading(false);
    };

    const fetchProducts = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        const { data } = await supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false });
        setProducts(data || []);
        setLoading(false);
    };

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed: ' + error.message);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            fetchOrders();
        } catch (error) {
            console.error("Status Update Failed", error);
        }
    };

    const setupCategories = async () => {
        const { data: existing } = await supabase.from('categories').select('id').limit(1);
        if (existing?.length === 0) {
            console.log("Seeding Categories...");
            await supabase.from('categories').insert([
                { name: 'Men', slug: 'men' },
                { name: 'Women', slug: 'women' },
                { name: 'Accessories', slug: 'accessories' }
            ]);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            setupCategories();
            fetchOrders();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <AdminLogin onLogin={setIsAuthenticated} />;
    }

    const filteredOrders = orders.filter(o =>
        (o.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customer_details?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background transition-colors duration-500">
            {/* Admin Sidebar/Nav */}
            <nav className="border-b border-foreground/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-foreground text-background rounded-sm flex items-center justify-center">
                            <Shield size={16} strokeWidth={3} />
                        </div>
                        <div>
                            <h1 className="text-[10px] font-black tracking-[0.4em] uppercase">Control Center</h1>
                            <p className="text-[8px] font-bold tracking-[0.2em] text-foreground/30 uppercase mt-1">StyleVault / Atelier Protocol</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex bg-foreground/5 p-1 rounded-sm flex-1 md:flex-none">
                            <button
                                onClick={() => { setView('orders'); setSearchTerm(''); }}
                                className={`flex-1 md:px-6 py-2 text-[9px] font-black tracking-widest uppercase transition-all ${view === 'orders' ? 'bg-foreground text-background' : 'text-foreground/40 hover:text-foreground'}`}
                            >
                                <div className="flex items-center justify-center gap-2 transition-all"><List size={12} /> <span className="hidden sm:inline">Manifests</span></div>
                            </button>
                            <button
                                onClick={() => { setView('products'); setSearchTerm(''); }}
                                className={`flex-1 md:px-6 py-2 text-[9px] font-black tracking-widest uppercase transition-all ${view === 'products' ? 'bg-foreground text-background' : 'text-foreground/40 hover:text-foreground'}`}
                            >
                                <div className="flex items-center justify-center gap-2 transition-all"><Box size={12} /> <span className="hidden sm:inline">Resources</span></div>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-foreground/5 p-1 rounded-full">
                                <button
                                    onClick={() => setThemeExplicit('light')}
                                    className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-foreground text-background shadow-luxury' : 'text-foreground/40 hover:text-foreground'}`}
                                >
                                    <Sun size={12} />
                                </button>
                                <button
                                    onClick={() => setThemeExplicit('dark')}
                                    className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-foreground text-background shadow-luxury' : 'text-foreground/40 hover:text-foreground'}`}
                                >
                                    <Moon size={12} />
                                </button>
                                <button
                                    onClick={() => setThemeExplicit('midnight')}
                                    className={`p-2 rounded-full transition-all ${theme === 'midnight' ? 'bg-foreground text-background shadow-luxury' : 'text-foreground/40 hover:text-foreground'}`}
                                >
                                    <Sparkles size={12} />
                                </button>
                            </div>
                            <button onClick={view === 'orders' ? fetchOrders : fetchProducts} className="p-2 hover:bg-foreground/5 rounded-full transition-colors font-black">
                                <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
                <AnimatePresence mode="wait">
                    {view === 'orders' ? (
                        <motion.div
                            key="orders-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8 md:space-y-16"
                        >
                            {/* Dashboard Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                {[
                                    { label: 'Active Manifests', value: orders.length, icon: Package },
                                    { label: 'Pending Logistics', value: orders.filter(o => o.status === 'PENDING').length, icon: RefreshCcw },
                                    { label: 'Completed Circuits', value: orders.filter(o => o.status === 'COMPLETED').length, icon: CheckCircle },
                                ].map((stat, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={i}
                                        className="bg-secondary border border-foreground/5 p-8 rounded-smooth"
                                    >
                                        <stat.icon size={16} className="text-foreground/20 mb-6" />
                                        <h3 className="text-[9px] font-black tracking-[0.3em] uppercase text-foreground/40 mb-2">{stat.label}</h3>
                                        <p className="text-3xl font-heading font-thin tracking-tighter">{stat.value.toString().padStart(2, '0')}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Main Feed */}
                            <div className="bg-secondary/50 border border-foreground/5 rounded-smooth overflow-hidden">
                                <div className="p-4 md:p-8 border-b border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
                                    <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-foreground/80">Live Order Feed</h2>
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={14} />
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="SEARCH MANIFEST / ID..."
                                            className="w-full bg-foreground/5 border border-foreground/10 py-3 pl-12 pr-4 rounded-full text-[9px] tracking-widest outline-none focus:border-accent transition-all uppercase text-foreground placeholder:text-foreground/20"
                                        />
                                    </div>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-foreground/5 text-[9px] font-black tracking-[0.3em] uppercase text-foreground/30">
                                                <th className="px-8 py-6">ID / Timestamp</th>
                                                <th className="px-8 py-6">Client Entity</th>
                                                <th className="px-8 py-6">Valuation</th>
                                                <th className="px-8 py-6">Process Status</th>
                                                <th className="px-8 py-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence mode="popLayout">
                                                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                                    <motion.tr
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        key={order.id}
                                                        className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors group"
                                                    >
                                                        <td className="px-8 py-8">
                                                            <div className="text-[10px] font-black tracking-widest text-foreground mb-1">{order.order_number}</div>
                                                            <div className="text-[8px] tracking-widest text-foreground/20 uppercase">{new Date(order.created_at).toLocaleString()}</div>
                                                        </td>
                                                        <td className="px-8 py-8">
                                                            <div className="text-[10px] font-semibold tracking-widest uppercase text-foreground/80">{order.customer_details?.name}</div>
                                                            <div className="text-[8px] tracking-widest text-foreground/20 uppercase">{order.customer_details?.email}</div>
                                                        </td>
                                                        <td className="px-8 py-8 text-[11px] font-black text-foreground">$ {(order.total_price || 0).toLocaleString()}</td>
                                                        <td className="px-8 py-8">
                                                            <span className={`text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full border ${order.status === 'PENDING' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                                                                order.status === 'COMPLETED' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                                                                    order.status === 'CANCELLED' ? 'border-red-500/20 text-red-400 bg-red-500/5' :
                                                                        'border-foreground/20 text-foreground/40 bg-foreground/5'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-8 text-right">
                                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {order.status === 'PENDING' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => updateStatus(order.id, 'COMPLETED')}
                                                                            className="p-3 bg-foreground text-background hover:scale-110 transition-transform rounded-sm shadow-luxury"
                                                                            title="Accept Order"
                                                                        >
                                                                            <CheckCircle size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => updateStatus(order.id, 'CANCELLED')}
                                                                            className="p-3 bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/40 hover:scale-110 transition-all rounded-sm"
                                                                            title="Reject Order"
                                                                        >
                                                                            <XCircle size={14} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <button
                                                                    onClick={() => order.customer_details?.payment_proof_url ? window.open(order.customer_details.payment_proof_url, '_blank') : alert('No Proof URL')}
                                                                    className={`p-3 border rounded-sm transition-colors ${order.customer_details?.payment_proof_url ? 'bg-foreground/5 border-foreground/10 hover:bg-foreground/20 text-foreground' : 'bg-transparent border-foreground/5 text-foreground/10 cursor-not-allowed'
                                                                        }`}
                                                                    disabled={!order.customer_details?.payment_proof_url}
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={5} className="px-8 py-20 text-center">
                                                            <div className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/10">No Manifests Detected</div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile List View */}
                                <div className="md:hidden divide-y divide-foreground/5">
                                    <AnimatePresence mode="popLayout">
                                        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={order.id}
                                                className="p-6 space-y-4"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-[10px] font-black tracking-widest text-foreground mb-1">{order.order_number}</div>
                                                        <div className="text-[8px] tracking-widest text-foreground/20 uppercase">{new Date(order.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <span className={`text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full border ${order.status === 'PENDING' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                                                        order.status === 'COMPLETED' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                                                            order.status === 'CANCELLED' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                                                                'border-foreground/20 text-foreground/40 bg-foreground/5'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-semibold tracking-widest uppercase text-foreground/80">{order.customer_details?.name}</div>
                                                    <div className="text-[8px] tracking-widest text-foreground/20 uppercase truncate">{order.customer_details?.email}</div>
                                                </div>
                                                <div className="flex justify-between items-center pt-2">
                                                    <div className="text-sm font-black text-foreground">$ {(order.total_price || 0).toLocaleString()}</div>
                                                    <div className="flex gap-2">
                                                        {order.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                                                                    className="p-2.5 bg-foreground text-background rounded-sm shadow-luxury"
                                                                >
                                                                    <CheckCircle size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => updateStatus(order.id, 'CANCELLED')}
                                                                    className="p-2.5 bg-red-500/20 text-red-400 border border-red-500/20 rounded-sm"
                                                                >
                                                                    <XCircle size={14} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => order.customer_details?.payment_proof_url ? window.open(order.customer_details.payment_proof_url, '_blank') : alert('No Proof URL')}
                                                            className={`p-2.5 border rounded-sm transition-colors ${order.customer_details?.payment_proof_url ? 'bg-foreground/5 border-foreground/10 text-foreground' : 'bg-transparent border-foreground/5 text-foreground/10 cursor-not-allowed'}`}
                                                            disabled={!order.customer_details?.payment_proof_url}
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <div className="px-8 py-20 text-center">
                                                <div className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/10">No Manifests Detected</div>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="resources-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-16"
                        >
                            {/* Resource Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <h2 className="text-[9px] md:text-[11px] font-black tracking-[0.4em] uppercase text-foreground/40 mb-2">Inventory Management</h2>
                                    <p className="text-2xl sm:text-4xl font-heading font-thin tracking-tighter">RESOURCE NEXUS</p>
                                </div>
                                <button
                                    onClick={() => { setEditingProduct(null); setShowEditor(true); }}
                                    className="w-full md:w-auto bg-foreground text-background px-6 md:px-10 py-4 text-[9px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:tracking-[0.4em] transition-all shadow-luxury"
                                >
                                    <Plus size={14} strokeWidth={3} /> <span className="sm:inline">Register Resource</span>
                                </button>
                            </div>

                            {/* Resource List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {products.map((p) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={p.id}
                                            className="bg-secondary border border-foreground/5 rounded-smooth overflow-hidden group transition-all duration-300 hover:border-foreground/20"
                                        >
                                            <div className="relative aspect-[4/5] bg-background overflow-hidden italic">
                                                {p.image_url && <img src={p.image_url} className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80" alt={p.name} />}
                                                <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => { setEditingProduct(p); setShowEditor(true); }}
                                                        className="p-3 bg-foreground text-background rounded-sm hover:scale-110 transition-all shadow-luxury"
                                                    >
                                                        <Edit size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(p.id)}
                                                        className="p-3 bg-red-500 text-white rounded-sm hover:scale-110 transition-all shadow-lg"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[8px] font-black tracking-widest text-foreground/20 uppercase">{p.category?.name}</span>
                                                    <span className="text-xs font-black text-foreground">${p.price}</span>
                                                </div>
                                                <h3 className="text-[10px] font-black tracking-widest uppercase">{p.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                                    <span className="text-[8px] font-black tracking-widest text-foreground/40 uppercase">{p.status}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {showEditor && (
                    <ProductEditor
                        product={editingProduct}
                        onSave={() => { setShowEditor(false); fetchProducts(); setEditingProduct(null); }}
                        onCancel={() => { setShowEditor(false); setEditingProduct(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
