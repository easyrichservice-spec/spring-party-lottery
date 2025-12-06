import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const { tickets } = await request.json();

  if (!tickets || !Array.isArray(tickets)) {
    return NextResponse.json({ ok: false, message: 'Invalid tickets' });
  }

  const supabase = createServerClient();

  const upperTickets = tickets.map((t: string) => t.trim().toUpperCase());

  const { data, error } = await supabase
    .from('prize_tickets')
    .select('ticket_no, prize_name, prize_area')
    .in('ticket_no', upperTickets);

  if (error) {
    return NextResponse.json({ ok: false, message: error.message });
  }

  // 建立 map
  const map = new Map();
  data?.forEach(row => map.set(row.ticket_no, row));

  // 回應格式與你原本查詢介面相同
  const results = upperTickets.map((t: string) => {
    const row = map.get(t);
    return row
      ? { ticket: t, prize: row.prize_name, area: row.prize_area }
      : { ticket: t, prize: '查無中獎紀錄', area: '-' };
  });

  return NextResponse.json({ ok: true, results });
}
