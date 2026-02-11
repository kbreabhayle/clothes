"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { onAuthStateChange, supabase } from '@/lib/supabase';

const STATUS_CONFIG = {
    PENDING: { color: 'yellow', icon: Clock, label: 'Pending Verification' },
    PACKED: { color: 'blue', icon: Package, label: 'Packed' },
    SHIPPED: { color: 'purple', icon: Package, label: 'Shipped' },
    COMPLETED: { color: 'green', icon: CheckCircle, label: 'Completed' },
    CANCELLED: { color: 'red', icon: XCircle, label: 'Cancelled' },
};

export default function OrdersPage() {
    const [user, setUser] = useState(undefined);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setOrders(data || []);
        setLoading(false);
    };

    if (user === undefined) return <div className="min-h-screen bg-black" />;

    if (user === null) {
        return (
            <main className="min-h-screen pt-24 bg-background flex items-center justify-center p-8">
                <Navbar />
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/40">
                        <ShieldAlert size={28} strokeWidth={1} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-thin tracking-tighter text-white mb-4 uppercase">Identity Required</h1>
                        <p className="text-[10px] text-white/30 tracking-widest uppercase leading-loose">
                            Sign in to view your order history.
                        </p>
                    </div>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                        className="w-full bg-white text-black py-5 text-[9px] font-black tracking-[0.4em] uppercase hover:tracking-[0.6em] transition-all duration-700"
                    >
                        Sign In / Register
                    </button>
                    <Link href="/shop" className="block text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">
                        Return to Gallery
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 bg-background">
            <Navbar />
            <section className="container-custom py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-3">Account</p>
                        <h1 className="text-xl font-bold tracking-wider uppercase text-white">Order History</h1>
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 animate-pulse">Loading Manifests...</div>
                        </div>
                    ) : orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 border border-white/5 rounded-sm"
                        >
                            <Package size={48} className="mx-auto text-white/10 mb-6" strokeWidth={1} />
                            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-white/20 mb-4">No Orders Yet</p>
                            <p className="text-[9px] text-white/10 tracking-widest uppercase mb-8">Your acquisition history will appear here.</p>
                            <Link href="/shop" className="text-[9px] font-black tracking-[0.4em] uppercase text-white border-b border-white/20 pb-1 hover:border-white transition-colors">
                                Explore Gallery
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {orders.map((order, index) => {
                                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                                    const StatusIcon = status.icon;
                                    const isExpanded = expandedOrder === order.id;

                                    return (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border border-white/5 hover:border-white/10 transition-all duration-300 rounded-sm overflow-hidden"
                                        >
                                            {/* Order Header - Always visible */}
                                            <button
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                className="w-full flex items-center justify-between p-8 text-left group"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-3 rounded-full border border-${status.color}-500/20 bg-${status.color}-500/5`}>
                                                        <StatusIcon size={16} className={`text-${status.color}-500`} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-black tracking-widest text-white uppercase mb-1">
                                                            {order.order_number}
                                                        </div>
                                                        <div className="text-[9px] tracking-widest text-white/20 uppercase">
                                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric', month: 'short', day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <span className={`text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full border
                                                        border-${status.color}-500/20 text-${status.color}-500 bg-${status.color}-500/5`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-sm font-black text-white">
                                                        ${(order.total_price || 0).toLocaleString()}
                                                    </span>
                                                    {isExpanded ? (
                                                        <ChevronUp size={14} className="text-white/30" />
                                                    ) : (
                                                        <ChevronDown size={14} className="text-white/30" />
                                                    )}
                                                </div>
                                            </button>

                                            {/* Expanded Details */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-8 pb-8 border-t border-white/5">
                                                            {/* Items */}
                                                            <div className="mt-6 mb-6">
                                                                <p className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">Items</p>
                                                                <div className="space-y-3">
                                                                    {(order.items || []).map((item, i) => (
                                                                        <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                                                            <div>
                                                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{item.name}</span>
                                                                                <span className="text-[9px] text-white/20 ml-3">× {item.qty || item.quantity || 1}</span>
                                                                            </div>
                                                                            <span className="text-[10px] font-black text-white">${(item.price || 0).toLocaleString()}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Order Details */}
                                                            <div className="grid grid-cols-2 gap-6">
                                                                <div>
                                                                    <p className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30 mb-2">Payment</p>
                                                                    <p className="text-[10px] text-white/60 uppercase tracking-wider">
                                                                        {order.customer_details?.payment_method || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30 mb-2">Status</p>
                                                                    <p className={`text-[10px] uppercase tracking-wider text-${status.color}-500`}>
                                                                        {status.label}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Total */}
                                                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                                                                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40">Total</span>
                                                                <span className="text-lg font-black text-white">${(order.total_price || 0).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    );
}
