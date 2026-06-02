import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 로컬 파일시스템 대신 Supabase Storage에서 파일 목록 조회
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.storage
      .from('uploads')
      .list('products', { sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      console.error('Supabase storage list error:', error);
      return NextResponse.json([]);
    }

    const fileList = (data || []).map((file) => {
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(`products/${file.name}`);
      return {
        name: file.name,
        url: urlData.publicUrl,
        size: file.metadata?.size || 0,
        createdAt: file.created_at,
      };
    });

    return NextResponse.json(fileList);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
