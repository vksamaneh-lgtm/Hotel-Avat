"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/context/LanguageContext";
import { hotelConfig } from "@/config/hotel.config";

export const ATTRACTIONS_DATA = hotelConfig.attractions;
export const HOTEL_COORDS: [number, number] = hotelConfig.location.coordinates;

/**
 * Calculates smooth quadratic bezier arc points between start and end coordinates.
 * Generates an organic curve with slight elevation.
 */
export function getCurvedPath(
  start: [number, number],
  end: [number, number],
  numPoints: number = 36,
  curvature: number = 0.16
): [number, number][] {
  const [lat0, lng0] = start;
  const [lat1, lng1] = end;

  const midLat = (lat0 + lat1) / 2;
  const midLng = (lng0 + lng1) / 2;

  const dLat = lat1 - lat0;
  const dLng = lng1 - lng0;

  // Perpendicular offset vector to create an arch
  const normLat = -dLng * curvature;
  const normLng = dLat * curvature;

  const ctrlLat = midLat + normLat;
  const ctrlLng = midLng + normLng;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const invT = 1 - t;
    const lat = invT * invT * lat0 + 2 * invT * t * ctrlLat + t * t * lat1;
    const lng = invT * invT * lng0 + 2 * invT * t * ctrlLng + t * t * lng1;
    points.push([lat, lng]);
  }
  return points;
}

interface HotelMapProps {
  activeAttractionIndex?: number | null;
  onSelectAttraction?: (idx: number | null) => void;
}

export default function HotelMap({
  activeAttractionIndex = null,
  onSelectAttraction,
}: HotelMapProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const hotelMarkerRef = useRef<any>(null);
  const connectionLayersRef = useRef<{
    glow?: any;
    diagonal?: any;
    midMarker?: any;
  }>({});
  const leafletRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    let isMounted = true;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    import("leaflet").then((L) => {
      if (!isMounted || !mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: false, // We'll add custom positioned zoom control
      }).setView(HOTEL_COORDS, 16);

      mapInstanceRef.current = map;

      // Add Zoom Control on safe side
      L.control
        .zoom({
          position: isEn ? "topright" : "topleft",
        })
        .addTo(map);

      // Clean OpenStreetMap Tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const hotelLabel = isEn ? hotelConfig.meta.nameEn : hotelConfig.meta.nameFa;
      const hotelAddress = isEn ? hotelConfig.location.addressEn : hotelConfig.location.addressFa;
      const hotelDescriptor = isEn
        ? hotelConfig.meta.subtitleEn
        : hotelConfig.meta.subtitleFa;

      // Custom Hotel Marker with exact pinpoint anchor and downward pointer
      const hotelIcon = L.divIcon({
        className: "custom-hotel-pin",
        html: `
          <div class="hotel-pin-wrapper" style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer; user-select: none; direction: ${isEn ? "ltr" : "rtl"};">
            <div class="hotel-pin-inner" style="background-color: #0494D6; color: #ffffff; padding: 7px 18px; border-radius: 9999px; font-weight: 800; font-family: inherit; font-size: 13px; box-shadow: 0 6px 22px rgba(4,148,214,0.45); display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 2px solid #ffffff; white-space: nowrap; width: max-content; min-width: max-content;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #c59b27; box-shadow: 0 0 8px #c59b27; flex-shrink: 0;"></span>
              <span style="white-space: nowrap; display: inline-block;">${hotelLabel}</span>
            </div>
            <!-- Pin Pointer Arrow -->
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #0494D6; margin-top: -1px;"></div>
            <!-- Pin Coordinate Anchor Dot -->
            <div style="width: 8px; height: 8px; border-radius: 9999px; background: #c59b27; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(197,155,39,0.9); margin-top: 1px;"></div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const hotelMarker = L.marker(HOTEL_COORDS, { icon: hotelIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: inherit; text-align: ${isEn ? "left" : "right"}; direction: ${isEn ? "ltr" : "rtl"}; min-width: 200px; padding: 2px;">
            <div style="font-size: 14px; font-weight: 800; color: #0494D6; margin-bottom: 4px;">${hotelLabel}</div>
            <div style="font-size: 12px; color: #555f6d; line-height: 1.5;">${hotelAddress}</div>
            <div style="margin-top: 8px; display: inline-block; background: #f0ece1; color: #0494D6; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px;">
              ${hotelDescriptor}
            </div>
          </div>`
        );

      hotelMarker.on("click", () => {
        onSelectAttraction?.(null);
      });

      hotelMarkerRef.current = hotelMarker;
      hotelMarker.openPopup();

      // Landmarks Markers
      markersRef.current = [];
      ATTRACTIONS_DATA.forEach((att, idx) => {
        const attName = isEn ? att.nameEn : att.nameFa;
        const attDist = isEn ? att.distEn : att.distFa;
        const attTime = isEn ? att.timeEn : att.timeFa;

        const attIcon = L.divIcon({
          className: `attraction-pin-${idx}`,
          html: `
            <div style="background: #ffffff; color: #0494D6; padding: 5px 14px; border-radius: 9999px; font-size: 12px; font-family: inherit; border: 1.5px solid #dfd9cc; box-shadow: 0 4px 14px rgba(0,0,0,0.12); white-space: nowrap; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; width: max-content; min-width: max-content; cursor: pointer; transform: translate(-50%, -50%); transition: transform 0.2s ease;">
              <span>${att.icon}</span>
              <span style="white-space: nowrap; display: inline-block;">${attName}</span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker(att.coords, { icon: attIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: inherit; text-align: ${isEn ? "left" : "right"}; direction: ${isEn ? "ltr" : "rtl"}; min-width: 180px; padding: 2px;">
              <div style="font-size: 13px; font-weight: 700; color: #0494D6; margin-bottom: 4px;">${att.icon} ${attName}</div>
              <div style="font-size: 11px; color: #8c7b64; margin-bottom: 6px;">${attTime}</div>
              <div style="display: inline-block; background: #0494D6; color: #ffffff; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700;">${attDist}</div>
            </div>`
          );

        marker.on("click", () => {
          onSelectAttraction?.(idx);
        });

        markersRef.current.push(marker);
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [language, isEn]);

  // Handle Dynamic Diagonal Path Drawing on Active Attraction
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    // Clear previous diagonal paths & midpoint markers
    if (connectionLayersRef.current.glow) {
      map.removeLayer(connectionLayersRef.current.glow);
    }
    if (connectionLayersRef.current.diagonal) {
      map.removeLayer(connectionLayersRef.current.diagonal);
    }
    if (connectionLayersRef.current.midMarker) {
      map.removeLayer(connectionLayersRef.current.midMarker);
    }
    connectionLayersRef.current = {};

    if (
      activeAttractionIndex !== null &&
      activeAttractionIndex !== undefined &&
      ATTRACTIONS_DATA[activeAttractionIndex]
    ) {
      const target = ATTRACTIONS_DATA[activeAttractionIndex];
      const targetCoords = target.coords;

      const curvedPoints = getCurvedPath(HOTEL_COORDS, targetCoords, 36, 0.16);

      // 1. Background Halo/Glow Curved Line
      const glowLine = L.polyline(curvedPoints, {
        color: "#ffffff",
        weight: 7,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // 2. Animated Curved Polyline
      const diagonalLine = L.polyline(curvedPoints, {
        color: "#c59b27",
        weight: 4,
        opacity: 0.95,
        className: "animated-diagonal-path",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // 3. Floating Midpoint Distance Badge positioned directly on curve
      const midCoords = curvedPoints[Math.floor(curvedPoints.length / 2)];

      const midBadge = L.divIcon({
        className: "diagonal-midpoint-badge",
        html: `
          <div style="background: #0494D6; color: #ffffff; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; border: 1.5px solid #c59b27; box-shadow: 0 4px 14px rgba(4,148,214,0.45); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; width: max-content; min-width: max-content; transform: translate(-50%, -50%);">
            <span style="font-size: 13px;">${target.icon}</span>
            <span style="white-space: nowrap; display: inline-block;">${isEn ? target.distEn : target.distFa}</span>
          </div>
        `,
        iconSize: [0, 0],
      });

      const midMarker = L.marker(midCoords, { icon: midBadge }).addTo(map);

      connectionLayersRef.current = {
        glow: glowLine,
        diagonal: diagonalLine,
        midMarker,
      };

      // 4. Smoothly Pan / Fit Bounds to encompass the curved route
      const bounds = L.latLngBounds(curvedPoints);
      map.fitBounds(bounds, {
        paddingTopLeft: [75, 75],
        paddingBottomRight: [75, 75],
        maxZoom: 16,
        animate: true,
        duration: 0.8,
      });

      // 5. Open popup on target
      markersRef.current[activeAttractionIndex]?.openPopup();
    } else {
      // Return to Hotel
      map.flyTo(HOTEL_COORDS, 16, {
        animate: true,
        duration: 0.8,
      });
      hotelMarkerRef.current?.openPopup();
    }
  }, [activeAttractionIndex, isEn]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] rounded-[24px] sm:rounded-[28px] z-10"
    />
  );
}
