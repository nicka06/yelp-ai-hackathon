"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the map component to avoid SSR issues
const GeofenceMapInternal = dynamic(() => import("./GeofenceMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-200 rounded-lg flex items-center justify-center">
      <p className="text-slate-500">Loading map...</p>
    </div>
  ),
});

interface GeofenceMapClientProps {
  center: [number, number];
  radius: number;
  onRadiusChange: (radius: number) => void;
  onCenterChange: (center: [number, number]) => void;
}

export default function GeofenceMapClient(props: GeofenceMapClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-slate-200 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">Loading map...</p>
      </div>
    );
  }

  return <GeofenceMapInternal {...props} />;
}

