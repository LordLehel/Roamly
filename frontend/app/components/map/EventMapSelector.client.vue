<template>
    <div class="relative w-full h-full min-h-[400px] flex flex-col">
        <div ref="mapContainer" class="w-full h-full z-0 rounded-md border-x border-t border-gray-200"></div>

        <div class="w-full bg-surface-50 border border-gray-200 rounded-b-md p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shrink-0">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-dark-text">Selected Location:</p>
                <p class="text-sm text-dark-text/80 truncate">
                    <span v-if="isLoadingAddress" class="opacity-60 animate-pulse">Loading address...</span>
                    <span v-else-if="currentSelection">{{ currentSelection.address }}</span>
                    <span v-else class="opacity-60">Click on the map or search to select a location.</span>
                </p>
            </div>
            <button 
                class="px-4 py-2 rounded-md font-medium text-white transition-colors duration-200 shrink-0"
                :class="currentSelection ? 'bg-brand-500 hover:bg-brand-600' : 'bg-gray-400 cursor-not-allowed'"
                :disabled="!currentSelection"
                @click="confirmSelection"
            >
                Confirm Location
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import 'leaflet/dist/leaflet.css';
    import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
    import L from 'leaflet';
    import 'leaflet-control-geocoder';

    import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
    import iconUrl from 'leaflet/dist/images/marker-icon.png';
    import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

    const defaultIconPrototype = L.Icon.Default.prototype as L.Icon & { _getIconUrl?: () => string };
    delete defaultIconPrototype._getIconUrl;

    L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

    interface GeocodeResult {
        name: string;
        center: { lat: number; lng: number };
    }

    interface MarkGeocodeEvent {
        geocode: GeocodeResult;
    }

    const emit = defineEmits<{
        (e: 'confirm-location', location: { latitude: number; longitude: number; address: string }): void;
    }>();

    const mapContainer = ref<HTMLElement | null>(null);
    let map: L.Map | null = null;
    let marker: L.Marker | null = null;

    // states for the location confirm button
    const currentSelection = ref<{ latitude: number; longitude: number; address: string } | null>(null);
    const isLoadingAddress = ref(false);

    const initmap = () => {
        if (!mapContainer.value) {
            return;
        }

        // default location the map is showing
        map = L.map(mapContainer.value).setView([44.111979, 24.347248], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href=https://leafletjs.com/>Leaflet</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.attributionControl.setPrefix(false);

        // search bar with Geocoder plugin
        const LControl = L.Control as unknown as {
            Geocoder: { nominatim: () => unknown };
            geocoder: (options: Record<string, unknown>) => L.Control & { on: (event: string, fn: (e: MarkGeocodeEvent) => void) => L.Control };
        };

        const geocoder = LControl.Geocoder.nominatim();

        LControl.geocoder({
            geocoder,
            defaultMarkGeocode: false,
            placeholder: 'Search for address...'
        })
        .on('markgeocode', (e: MarkGeocodeEvent) => {
            const lat = e.geocode.center.lat;
            const lng = e.geocode.center.lng;
            const address = e.geocode.name;

            map?.setView([lat, lng], 17);
            updateMarker(lat, lng);

            currentSelection.value = { latitude: lat, longitude: lng, address };
        })
        .addTo(map);

        // clicking event on the map (reverse geocode)
        map.on('click', async (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;

            // instant marker placement
            updateMarker(lat, lng);
            currentSelection.value = { latitude: lat, longitude: lng, address: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` };
            isLoadingAddress.value = true;

            // fetch for the reverse geocoding
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            
                const data = await response.json();
                
                if (data && data.display_name && currentSelection.value) {
                    currentSelection.value.address = data.display_name;
                }
            } catch (error) {
                console.error('Failed to fetch address:', error);
            } finally {
                isLoadingAddress.value = false;
            }
        });

        setTimeout(() => {
            map?.invalidateSize();
        }, 250);
    };

    const updateMarker = (lat: number, lng: number) => {
        if (!map) {
            return;
        }

        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }

    };

    // location confrm button
    const confirmSelection = () => {
        if (currentSelection.value) {
            emit('confirm-location', currentSelection.value);
        }
    };

    onMounted(() => {
        initmap();
    });

    onUnmounted(() => {
        if (map) {
            map.remove();
        }
    });
</script>