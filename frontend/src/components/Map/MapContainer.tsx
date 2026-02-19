import { useEffect, useRef, useState } from "react";

import Map from "ol/Map";
import View from "ol/View";

import { Box } from "@mui/material";

import MapHud from "./MapHud.tsx";
import { MapContext } from "./MapContext.ts";
import TooltipOverlay from "./TooltipOverlay.tsx";

interface Props {
  children: React.ReactNode;
}

const MapContainer = ({ children }: Props) => {
  const [mapInstance, setMapInstance] = useState<Map | null>(null);

  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    const map = new Map({
      target: mapElement.current,
      view: new View({
        center: [3874286.4007465374, 3670794.1879844004],
        zoom: 8,
      }),
      layers: [],
    });

    setMapInstance(map);

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <MapContext.Provider value={{ map: mapInstance }}>
      <Box
        ref={mapElement}
        sx={{ width: "100%", height: "100%", position: "relative" }}
      >
        {mapInstance && children}

        <MapHud />

        <TooltipOverlay map={mapInstance} />
      </Box>
    </MapContext.Provider>
  );
};

export default MapContainer;
