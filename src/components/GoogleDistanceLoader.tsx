"use client";

import { useEffect } from "react";
import { hotelConfig } from "@/config/hotel.config";

export interface GoogleRouteData {
  distanceMeters: number;
  durationSeconds: number;
  distanceFa: string;
  distanceEn: string;
  timeFa: string;
  timeEn: string;
  mode: "WALKING" | "DRIVING";
}

export type RouteDataByAttraction = Record<number, GoogleRouteData>;

interface GoogleDistanceLoaderProps {
  onRouteDataChange?: (routes: RouteDataByAttraction) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
let googleMapsPromise: Promise<any> | null = null;

function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser only"));
  if ((window as any).google?.maps) return Promise.resolve((window as any).google.maps);
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error("Google Maps API key is missing"));
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-avat-google-maps="true"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve((window as any).google.maps));
      existingScript.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.dataset.avatGoogleMaps = "true";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve((window as any).google.maps);
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function formatDistance(meters: number, isEn: boolean): string {
  if (meters < 1000) {
    const value = String(Math.round(meters));
    return isEn ? `${value} m` : `${toPersianDigits(value)} متر`;
  }
  const value = (meters / 1000).toFixed(2).replace(/\.00$/, "");
  return isEn ? `${value} km` : `${toPersianDigits(value.replace(".", "٫"))} کیلومتر`;
}

function formatDuration(seconds: number, isEn: boolean): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return isEn ? `${minutes} min route` : `${toPersianDigits(String(minutes))} دقیقه مسیر`;
}

export default function GoogleDistanceLoader({ onRouteDataChange }: GoogleDistanceLoaderProps) {
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;

    let isMounted = true;
    loadGoogleMaps()
      .then((maps) => {
        if (!isMounted) return;
        const service = new maps.DirectionsService();
        const origin = {
          lat: hotelConfig.location.coordinates[0],
          lng: hotelConfig.location.coordinates[1],
        };

        const requests = hotelConfig.attractions.map(
          (attraction) =>
            new Promise<{ id: number; result: any } | null>((resolve) => {
              service.route(
                {
                  origin,
                  destination: { lat: attraction.coords[0], lng: attraction.coords[1] },
                  travelMode: maps.TravelMode[attraction.routeMode],
                  unitSystem: maps.UnitSystem.METRIC,
                  provideRouteAlternatives: false,
                },
                (result: any, status: string) => {
                  resolve(status === "OK" && result ? { id: attraction.id, result } : null);
                }
              );
            })
        );

        Promise.all(requests).then((routes) => {
          if (!isMounted) return;
          const routeData: RouteDataByAttraction = {};
          routes.forEach((route) => {
            if (!route) return;
            const attraction = hotelConfig.attractions.find((item) => item.id === route.id);
            const leg = route.result.routes?.[0]?.legs?.[0];
            const distanceMeters = Number(leg?.distance?.value ?? 0);
            const durationSeconds = Number(leg?.duration?.value ?? 0);
            if (!attraction || !distanceMeters) return;
            routeData[route.id] = {
              distanceMeters,
              durationSeconds,
              distanceFa: formatDistance(distanceMeters, false),
              distanceEn: formatDistance(distanceMeters, true),
              timeFa: formatDuration(durationSeconds, false),
              timeEn: formatDuration(durationSeconds, true),
              mode: attraction.routeMode,
            };
          });
          onRouteDataChange?.(routeData);
        });
      })
      .catch(() => {
        // Configured fallback distances remain visible until a valid key is supplied.
      });

    return () => {
      isMounted = false;
    };
  }, [onRouteDataChange]);

  return null;
}
