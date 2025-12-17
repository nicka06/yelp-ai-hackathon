"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface GeofenceMapProps {
  center: [number, number];
  radius: number;
  onRadiusChange: (radius: number) => void;
  onCenterChange: (center: [number, number]) => void;
}

function MapController({
  onCenterChange,
}: {
  onCenterChange: (center: [number, number]) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onCenterChange([center.lat, center.lng]);
    },
  });
  return null;
}

export default function GeofenceMap({
  center,
  radius,
  onRadiusChange,
  onCenterChange,
}: GeofenceMapProps) {
  useEffect(() => {
    // Import Leaflet CSS dynamically
    import("leaflet/dist/leaflet.css");
  }, []);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-slate-300 shadow-lg">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={center}
          radius={radius}
          pathOptions={{
            color: "#FF6B35",
            fillColor: "#FF6B35",
            fillOpacity: 0.2,
            weight: 2,
          }}
        />
        <MapController onCenterChange={onCenterChange} />
      </MapContainer>
    </div>
  );
}

