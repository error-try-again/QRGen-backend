import {Client} from "@googlemaps/google-maps-services-js";
import {GOOGLE_MAPS_API_KEY} from "../config.ts";

function getApiKey(): string {
    if (GOOGLE_MAPS_API_KEY) {
        return GOOGLE_MAPS_API_KEY;
    } else {
        throw new Error('GOOGLE_MAPS_API_KEY is missing in the environment variables.');
    }
}

async function geocodeAddress(client: Client, apiKey: string, address: string) {
    try {
        const geocodeResponse = await client.geocode({
            params: { key: apiKey, address }
        });
        console.log(`Geocode result: ${JSON.stringify(geocodeResponse.data.results[0])}`);
    } catch (error) {
        console.error('Error in geocoding:', error);
    }
}

async function reverseGeocodeLatLng(client: Client, apiKey: string, lat: number, lng: number) {
    try {
        const reverseGeocodeResponse = await client.reverseGeocode({
            params: { key: apiKey, latlng: { lat, lng } }
        });
        console.log(`Reverse Geocode result: ${JSON.stringify(reverseGeocodeResponse.data.results[0])}`);
    } catch (error) {
        console.error('Error in reverse geocoding:', error);
    }
}

export const handlePlaceRetrieval = async (latitude: number, longitude: number): Promise<void> => {
    try {
        const client = new Client({});
        const apiKey = getApiKey();
        const customAddress = 'Perth 4WD & Commercial Centre';

        await geocodeAddress(client, apiKey, customAddress);
        await reverseGeocodeLatLng(client, apiKey, latitude, longitude);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
