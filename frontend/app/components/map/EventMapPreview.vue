<template>
    <div ref="mapContainer" class="w-full h-full z-0"></div>
</template>

<script setup lang="ts">
    import { ref, onUnmounted, watch } from 'vue';
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';

    import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
    import iconUrl from 'leaflet/dist/images/marker-icon.png';
    import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

    const props = defineProps<{ latitude: number; longitude: number }>();
    const mapContainer = ref<HTMLElement | null>(null);
    let map: L.Map | null = null;
    let marker: L.Marker | null = null;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
    });

    const initMap = () => {
        if (!mapContainer.value) {
            return;
        }
        map = L.map(mapContainer.value).setView([props.latitude, props.longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    };

    onMounted(() => {
        initMap();
    });

    watch(() => [props.latitude, props.longitude], ([newLat, newLng]) => {
        if (map && marker) {
            const latLng = new L.LatLng(newLat, newLng);
            map.setView(latLng, 15);
            marker.setLatLng(latLng);
        }
    });

    onUnmounted(() => {
        if (map) map.remove();
    });
</script>