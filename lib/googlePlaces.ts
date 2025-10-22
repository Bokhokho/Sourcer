import { env } from 'process';

export interface SearchInput {
  keyword?: string;
  category?: string;
  location: { lat: number; lng: number } | { cityOrZip: string };
  radiusMeters: number;
  maxPages?: number;
}

export interface NormalizedPlace {
  placeId?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  main_service: string;
  keywords?: string;
  contact_info?: {
    phone?: string;
    website?: string;
    email?: string;
  };
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.warn('Missing GOOGLE_MAPS_API_KEY environment variable.');
}

/**
 * Delay helper used when consuming the Google Places next_page_token.  The API
 * requires a small delay (~2 seconds) before the next page becomes valid.
 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Performs a geocoding request for a city or ZIP code.  Returns latitude
 * and longitude coordinates.  Uses the Google Geocoding API (part of
 * Google Maps) behind the scenes.
 */
async function geocodeCity(cityOrZip: string): Promise<{ lat: number; lng: number } | null> {
  const encoded = encodeURIComponent(cityOrZip);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GOOGLE_PLACES_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const result = json.results?.[0];
  if (!result) return null;
  return result.geometry.location;
}

/**
 * Calls the Places Details endpoint to fetch phone numbers and website
 * for a specific place.  We request only a handful of fields to
 * minimize quota usage.
 */
async function fetchPlaceDetails(placeId: string) {
  const fields = ['formatted_address', 'international_phone_number', 'website', 'address_components'].join(',');
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

/**
 * Parses address components into city, state and ZIP code.  Falls back
 * to empty strings when components are missing.
 */
function parseAddressComponents(components: any[]): { city: string; state: string; zip: string } {
  let city = '';
  let state = '';
  let zip = '';
  for (const comp of components) {
    if (comp.types.includes('locality')) {
      city = comp.long_name;
    } else if (comp.types.includes('administrative_area_level_1')) {
      state = comp.short_name;
    } else if (comp.types.includes('postal_code')) {
      zip = comp.long_name;
    }
  }
  return { city, state, zip };
}

/**
 * Performs a Places Text Search and optional pagination.  It accepts
 * either a precise latitude/longitude or a city/ZIP code string to
 * determine the search center.  Returns a list of normalized places.
 */
export async function searchPlaces(input: SearchInput): Promise<NormalizedPlace[]> {
  const { keyword, category, radiusMeters, maxPages = 1 } = input;
  let lat: number | undefined;
  let lng: number | undefined;
  if ('lat' in input.location && 'lng' in input.location) {
    lat = input.location.lat;
    lng = input.location.lng;
  } else if ('cityOrZip' in input.location) {
    const geo = await geocodeCity(input.location.cityOrZip);
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
    } else {
      throw new Error('Could not geocode the provided location');
    }
  }
  if (lat == null || lng == null) {
    throw new Error('Location missing');
  }
  const queryParts: string[] = [];
  if (keyword) queryParts.push(keyword);
  if (category) queryParts.push(category);
  const query = encodeURIComponent(queryParts.join(' '));
  const location = `${lat},${lng}`;
  const radius = radiusMeters;
  let nextPageToken: string | undefined;
  const results: NormalizedPlace[] = [];
  for (let page = 0; page < maxPages; page++) {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;
    if (nextPageToken) {
      url += `&pagetoken=${nextPageToken}`;
      // Wait a bit before requesting the next page as required by Google.
      await delay(2000);
    }
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      // handle quota errors gracefully
      console.warn('Google Places returned status:', data.status);
      break;
    }
    const places = data.results || [];
    for (const place of places) {
      const placeId = place.place_id as string | undefined;
      const name = place.name as string;
      const formatted = place.formatted_address as string;
      let city = '';
      let state = '';
      let zip = '';
      // Attempt to parse address components if present on the search result
      if (place.address_components) {
        const parsed = parseAddressComponents(place.address_components);
        city = parsed.city;
        state = parsed.state;
        zip = parsed.zip;
      } else {
        // fallback: try to split the formatted address
        const parts = formatted?.split(',');
        if (parts && parts.length >= 3) {
          city = parts[parts.length - 3]?.trim() ?? '';
          const stateZip = parts[parts.length - 2]?.trim().split(' ') ?? [];
          state = stateZip[0] ?? '';
          zip = stateZip[1] ?? '';
        }
      }
      const normalized: NormalizedPlace = {
        placeId,
        name,
        address: formatted ?? '',
        city,
        state,
        zip,
        main_service: category ?? '',
        keywords: keyword ?? category ?? '',
        contact_info: {},
      };
      // Optionally enrich contact info via Place Details
      if (placeId) {
        try {
          const detailJson = await fetchPlaceDetails(placeId);
          const detail = detailJson?.result;
          if (detail) {
            if (detail.international_phone_number) {
              normalized.contact_info!.phone = detail.international_phone_number;
            }
            if (detail.website) {
              normalized.contact_info!.website = detail.website;
            }
            if (detail.address_components) {
              const more = parseAddressComponents(detail.address_components);
              normalized.city = more.city || normalized.city;
              normalized.state = more.state || normalized.state;
              normalized.zip = more.zip || normalized.zip;
            }
          }
        } catch (err) {
          console.warn('Failed to fetch place details for', placeId, err);
        }
      }
      results.push(normalized);
    }
    nextPageToken = data.next_page_token;
    if (!nextPageToken) {
      break;
    }
  }
  return results;
}