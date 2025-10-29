"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import ReactDOMServer from 'react-dom/server';

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const stopIcon = L.divIcon({
  html: ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faBus} style={{ color: "#2563eb", fontSize: "24px" }} />
  ),
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const start = [21.028511, 105.804817]; // Hà Nội
const end = [20.844911, 106.688084]; // Hải Phòng

// 🚌 Danh sách trạm dừng
const stops = [
  { name: "Bến xe Gia Lâm", coords: [21.0393, 105.886] },
  { name: "TP Hải Dương", coords: [20.939, 106.3306] },
  { name: "Bến xe Niệm Nghĩa", coords: [20.8461, 106.6603] },
];

export default function DriverMap() {
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    async function fetchRoute() {
      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.NEXT_PUBLIC_ORS_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
      );
      const data = await res.json();
      const coords = data.features[0].geometry.coordinates.map(
        (c: number[]) => [c[1], c[0]]
      );
      setRoute(coords);
    }
    fetchRoute();
  }, []);

  return (
    <MapContainer
      center={start}
      zoom={9}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OSM</a> contributors'
      />

      {/* Tuyến đường */}
      {route.length > 0 && <Polyline positions={route} color="blue" />}

      {/* Điểm đầu / cuối */}
      <Marker position={start} icon={icon}>
        <Popup>Điểm xuất phát</Popup>
      </Marker>
      <Marker position={end} icon={icon}>
        <Popup>Điểm đến</Popup>
      </Marker>

      {/* Các trạm dừng */}
      {stops.map((stop, i) => (
        <Marker key={i} position={stop.coords} icon={stopIcon}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
