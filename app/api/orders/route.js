import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Handle Order Submission (POST) and Admin Fetch (GET)
export async function POST(request) {
    try {
        const orderData = await request.json();

        if (!orderData.items || orderData.items.length === 0) {
            return NextResponse.json({ error: 'Manifest Empty' }, { status: 400 });
        }

        const orderNumber = `SV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                order_number: orderNumber,
                customer_details: orderData.customer_details,
                items: orderData.items,
                total_price: orderData.pricing?.total || 0,
                status: 'PENDING'
            }])
            .select()
            .single();

        if (error) throw error;

        console.log(`[OMS] Order ${orderNumber} Synchronized with DB.`);

        return NextResponse.json({
            success: true,
            order_id: data.id,
            order_number: data.order_number,
            timestamp: data.created_at
        });
    } catch (error) {
        console.error('Submission Error:', error);
        return NextResponse.json({ error: 'Transmission Failure' }, { status: 500 });
    }
}

export async function GET() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PATCH(request) {
    try {
        const { id, status } = await request.json();
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, order: data });
    } catch (error) {
        return NextResponse.json({ error: 'Update Interrupted' }, { status: 500 });
    }
}
