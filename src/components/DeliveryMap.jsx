"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function DeliveryMap({
  farmerLocation,
  customerLocation,
}) {
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (
      !farmerLocation?.lat ||
      !farmerLocation?.lng ||
      !customerLocation?.lat ||
      !customerLocation?.lng
    ) {
      return;
    }

    const getRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${farmerLocation.lng},${farmerLocation.lat};${customerLocation.lng},${customerLocation.lat}?overview=full&geometries=geojson`
        );

        const data = await res.json();

        if (!data.routes?.length) {
          return;
        }

        const routeData = data.routes[0];

        const points = routeData.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        setRoute(points);

        // Distance in KM
        setDistance(
          (routeData.distance / 1000).toFixed(2)
        );

        // Duration in Minutes
        setDuration(
          Math.ceil(routeData.duration / 60)
        );
      } catch (err) {
        console.log("Route Error:", err);
      }
    };

    getRoute();
  }, [farmerLocation, customerLocation]);

  return (
    <div className="w-full">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-4">
          <p className="text-sm text-gray-400">
            Distance
          </p>

          <h3 className="text-2xl font-bold text-green-500">
            🚚 {distance ?? "--"} km
          </h3>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
          <p className="text-sm text-gray-400">
            Estimated Time
          </p>

          <h3 className="text-2xl font-bold text-blue-400">
            ⏱ {duration ?? "--"} min
          </h3>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-3 text-sm">
        <div>
          🌾 <span className="font-medium">Farmer</span>
        </div>

        <div>
          🛒 <span className="font-medium">Customer</span>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[
          farmerLocation.lat,
          farmerLocation.lng,
        ]}
        zoom={12}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "16px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Farmer */}
        <Marker
          position={[
            farmerLocation.lat,
            farmerLocation.lng,
          ]}
        />

        {/* Customer */}
        <Marker
          position={[
            customerLocation.lat,
            customerLocation.lng,
          ]}
        />

        {/* Route */}
        {route.length > 0 && (
          <Polyline positions={route} />
        )}
      </MapContainer>
    </div>
  );
}