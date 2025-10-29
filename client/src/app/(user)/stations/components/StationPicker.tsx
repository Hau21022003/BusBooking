"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker mặc định
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface StationPickerProps {
  // Nếu truyền station thì focus vào đó (trường hợp edit/findOne)
  station?: {
    lat: number;
    lng: number;
  };
  onChange?: (coords: { lat: number; lng: number }) => void;
}

export default function StationPicker({
  station,
  onChange,
}: StationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    station ? [station.lat, station.lng] : null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    21.0285, 105.8542,
  ]); // Default: Hà Nội
  const [loadingLocation, setLoadingLocation] = useState(!station);

  // ✅ Nếu không có station (tức là tạo mới) → lấy vị trí người dùng
  useEffect(() => {
    if (!station) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userPos: [number, number] = [
              pos.coords.latitude,
              pos.coords.longitude,
            ];
            setMapCenter(userPos);
            setPosition(userPos);
            setLoadingLocation(false);
          },
          () => {
            setLoadingLocation(false);
            console.warn("Không thể lấy vị trí người dùng");
          }
        );
      } else {
        setLoadingLocation(false);
      }
    }
  }, [station]);

  // ✅ Khi click bản đồ
  function LocationSelector() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onChange?.({ lat, lng });
      },
    });
    return null;
  }

  return (
    <div className="space-y-3">
      {loadingLocation ? (
        <p className="text-gray-500">⏳ Đang xác định vị trí hiện tại...</p>
      ) : (
        <MapContainer
          center={position || mapCenter}
          zoom={13}
          style={{ height: "100px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
          />

          <LocationSelector />

          {position && (
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const newPos = e.target.getLatLng();
                  setPosition([newPos.lat, newPos.lng]);
                  onChange?.({ lat: newPos.lat, lng: newPos.lng });
                },
              }}
              icon={markerIcon}
            >
              <Popup>
                <b>Toạ độ trạm</b>
                <br />
                Lat: {position[0].toFixed(6)}
                <br />
                Lng: {position[1].toFixed(6)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}

      {position && (
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            📍 <strong>Toạ độ trạm:</strong> {position[0].toFixed(6)},{" "}
            {position[1].toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
