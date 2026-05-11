import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Loader2, Navigation } from 'lucide-react';
import axios from 'axios';

interface LocationMapPickerProps {
  onLocationSelect: (location: { district: string; municipality: string; lat: number; lng: number }) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 27.7172, lng: 85.324 }; // Kathmandu

export const LocationMapPicker = ({ onLocationSelect }: LocationMapPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsResolving(true);
    setResolvedAddress(null);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      if (response.data.results?.length > 0) {
        const components = response.data.results[0].address_components;
        let district = '';
        let municipality = '';

        components.forEach((comp: any) => {
          if (comp.types.includes('administrative_area_level_3') || comp.types.includes('locality')) {
            municipality = comp.long_name;
          }
          if (comp.types.includes('administrative_area_level_2')) {
            district = comp.long_name;
          }
        });

        const formatted = response.data.results[0].formatted_address;
        setResolvedAddress(formatted);

        return { district, municipality };
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
    } finally {
      setIsResolving(false);
    }
    return null;
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    await reverseGeocode(lat, lng);
  };

  const handleConfirm = async () => {
    if (!marker) return;
    const result = await reverseGeocode(marker.lat, marker.lng);
    if (result) {
      onLocationSelect({
        district: result.district,
        municipality: result.municipality,
        lat: marker.lat,
        lng: marker.lng,
      });
    }
    setIsOpen(false);
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMarker(coords);
          mapRef.current?.panTo(coords);
          mapRef.current?.setZoom(14);
          reverseGeocode(coords.lat, coords.lng);
        },
        (err) => console.error('Geolocation error:', err)
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium text-indigo-600 flex items-center gap-1.5 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 hover:bg-indigo-100"
      >
        <MapPin className="w-3.5 h-3.5" />
        Pick on Map
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-indigo-950">Select Your Location</h3>
                  <p className="text-xs text-slate-500">Tap on the map to set your location</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Map */}
              <div className="h-[400px] relative">
                {loadError && (
                  <div className="h-full flex items-center justify-center text-red-500 text-sm">
                    Failed to load map. Please check your connection.
                  </div>
                )}
                {!isLoaded && !loadError && (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  </div>
                )}
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={marker || defaultCenter}
                    zoom={marker ? 14 : 7}
                    onClick={handleMapClick}
                    onLoad={onMapLoad}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                      styles: [
                        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                      ],
                    }}
                  >
                    {marker && <Marker position={marker} />}
                  </GoogleMap>
                )}

                {/* Locate Me Button */}
                <button
                  type="button"
                  onClick={handleLocateMe}
                  className="absolute bottom-4 right-4 z-10 bg-white shadow-lg rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-indigo-700 border border-slate-200 hover:bg-indigo-50 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Locate Me
                </button>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {isResolving && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Resolving address...
                    </div>
                  )}
                  {resolvedAddress && !isResolving && (
                    <p className="text-sm text-slate-700 truncate">
                      <span className="font-medium text-slate-500">📍</span> {resolvedAddress}
                    </p>
                  )}
                  {!resolvedAddress && !isResolving && (
                    <p className="text-sm text-slate-400">Click the map to select a location</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!marker || isResolving}
                  className="px-6 py-2.5 bg-indigo-900 text-white rounded-xl text-sm font-medium hover:bg-indigo-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
                >
                  Confirm Location
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
