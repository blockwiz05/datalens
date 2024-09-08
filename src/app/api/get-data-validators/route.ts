import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('perPage') || '10';
  const ordering = searchParams.get('ordering') || 'status'; // Default ordering

  try {
    // Fetching data from the API with pagination and ordering
    const response = await fetch(`https://api.ssv.network/api/v4/mainnet/validators?page=${page}&perPage=${perPage}&ordering=${ordering}`);

    // Check if the request was successful
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
    }

    // Parse the response data as JSON
    const data = await response.json();
    // Return the data in the response
    return NextResponse.json(data);
  } catch (error) {
    // Handle any errors that occurred during the fetch
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
