import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('perPage') || '10';

  try {
    const response = await fetch(`https://api.ssv.network/api/v4/mainnet/operators?page=${page}&perPage=${perPage}&ordering=validators_count:desc`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}