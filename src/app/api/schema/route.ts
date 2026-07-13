import { NextResponse } from 'next/server';
import { getUser, createClient } from '@/lib/supabase/server';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_schemas')
    .select('content, format')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? null);
}

export async function PUT(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, format } = await request.json();
  if (!content || !format) {
    return NextResponse.json({ error: 'Content and format are required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from('user_schemas').upsert(
    {
      user_id: user.id,
      content,
      format,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
