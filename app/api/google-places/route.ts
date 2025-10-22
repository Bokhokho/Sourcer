import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces } from '@/lib/googlePlaces';

/**
 * Proxy route for the Google Places API.  Accepts POST requests with a
 * JSON body describing the search parameters.  Delegates the actual
 * request to the server‑side `searchPlaces` helper which handles
 * geocoding, pagination and normalization.  Returns an array of
 * normalized place objects.  The Google API key is **never** sent to
 * the client.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const results = await searchPlaces(body);
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error in Google Places route:', error);
    return NextResponse.json({ error: error.message ?? 'Internal Error' }, { status: 500 });
  }
}