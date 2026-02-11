import { supabase } from './supabase';

export async function getProducts(categorySlug = null) {
    let query = supabase
        .from('products')
        .select(`
      *,
      category:categories(slug, name)
    `)
        .eq('status', 'active');

    if (categorySlug) {
        query = query.filter('categories.slug', 'eq', categorySlug);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Fetch Error:', error);
        return [];
    }

    // Transform for frontend if necessary
    return data.map(p => ({
        ...p,
        image: p.image_url,
        category: p.category?.name || 'Uncategorized'
    }));
}

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Fetch Error:', error);
        return [];
    }
    return data;
}

// Local mock data removed. All data now fetched from Supabase.
