
/**
 * FinGuard Weather Service
 * Integrated with Open-Meteo for real-time environmental data
 * and Nominatim for reverse geocoding.
 */

export interface WeatherData {
  temp: number;
  pressure: number;
  uvi: number;
  description: string;
  locationName?: string;
}

/**
 * Mock data representing typical conditions in Canning, West Bengal
 */
const MOCK_WEATHER: WeatherData = {
  temp: 29.5,
  pressure: 1008,
  uvi: 8.2,
  description: "Regional Estimate (Sync Offline)",
  locationName: "Canning, West Bengal"
};

export const fetchWeatherByCoords = async (lat: number, lng: number): Promise<WeatherData> => {
  // 1. Fetch Weather Data from Open-Meteo
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,surface_pressure,uv_index&timezone=auto`;
  
  // 2. Fetch Place Name from Nominatim (OpenStreetMap)
  const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;

  try {
    const [weatherRes, geoRes] = await Promise.all([
      fetch(weatherUrl).catch(() => null),
      fetch(geoUrl, { headers: { 'Accept-Language': 'en' } }).catch(() => null)
    ]);

    // If fetch failed completely (CORS/Offline), use mock data
    if (!weatherRes || !weatherRes.ok) {
      console.warn("Weather API unreachable. Using regional estimate.");
      return MOCK_WEATHER;
    }
    
    const weatherData = await weatherRes.json();
    let locationName = MOCK_WEATHER.locationName;

    if (geoRes && geoRes.ok) {
      const geoData = await geoRes.json();
      const address = geoData.address;
      locationName = address.city || address.town || address.village || address.suburb || address.state_district || MOCK_WEATHER.locationName;
    }

    const current = weatherData.current;

    return {
      temp: current.temperature_2m,
      pressure: current.surface_pressure,
      uvi: current.uv_index,
      description: "Atmospheric Sync Active",
      locationName: locationName
    };
  } catch (error) {
    console.error("Weather service critical failure. Returning mock data.");
    return MOCK_WEATHER;
  }
};
