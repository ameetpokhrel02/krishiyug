import axios from 'axios';
import ApiResponse from '../utils/ApiResponse.js';

export const reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!lat || !lng) {
            return res.status(400).json(new ApiResponse(400, null, "Latitude and Longitude are required"));
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );

        if (response.data.status !== 'OK') {
            throw new Error(response.data.error_message || 'Geocoding failed');
        }

        // Parse Google Maps response to find District and Palika (Administrative Area Level 2 and 3/Locality)
        const addressComponents = response.data.results[0].address_components;
        let district = '';
        let palika = '';

        addressComponents.forEach(comp => {
            if (comp.types.includes('administrative_area_level_2')) {
                district = comp.long_name;
            }
            if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_3')) {
                palika = comp.long_name;
            }
        });

        return res.status(200).json(new ApiResponse(200, { district, palika, fullAddress: response.data.results[0].formatted_address }, "Location detected successfully"));

    } catch (error) {
        console.error("Geocoding Error:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to detect location"));
    }
};
