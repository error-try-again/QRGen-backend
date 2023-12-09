import { GOOGLE_MAPS_API_KEY } from '../config';
import { ErrorType } from '../ts/enums/error-enum';
import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

function getApiKey(): string {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is missing in the environment variables.');
  }
  return GOOGLE_MAPS_API_KEY;
}

async function geocodeAddress(address: string): Promise<any> {
  const apiKey = getApiKey();
  try {
    const response = await client.geocode({ params: { key: apiKey, address } });
    return response.data.results;
  } catch {
    throw new Error(ErrorType.GOOGLE_MAPS_GEOCODE_ERROR);
  }
}

export async function reverseGeocodeLatLng(lat: number, lng: number): Promise<any> {
  const apiKey = getApiKey();
  try {
    const response = await client.reverseGeocode({
      params: {
        key: apiKey,
        latlng: { lat, lng }
      }
    });
    return response.data.results;
  } catch {
    throw new Error(ErrorType.GOOGLE_MAPS_REVERSE_GEOCODE_ERROR);
  }
}

export async function handleSearchAutocomplete(searchString: string): Promise<any> {
  try {
    const apiKey = getApiKey();
    const response = await client.placeAutocomplete({
      params: {
        key: apiKey,
        input: searchString
      }
    });
    return response.data.predictions;
  } catch {
    throw new Error(ErrorType.GOOGLE_MAPS_AUTO_COMPLETE_ERROR);
  }
}

export const retrievePlaceByAddress = async (address: string): Promise<void> => {
  try {
    await geocodeAddress(address);
  } catch (error) {
    throw error;
  }
};
