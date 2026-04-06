// Nominatim requires a descriptive User-Agent
const HEADERS = {
  'Accept-Language': 'en-US,en;q=0.9',
};

export interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
}

export const searchAddress = async (query: string): Promise<GeocodeResult[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
      { headers: HEADERS }
    );
    const data = await res.json();
    
    return data.map((item: any) => ({
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Geocoding search error:', error);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: HEADERS }
    );
    const data = await res.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};