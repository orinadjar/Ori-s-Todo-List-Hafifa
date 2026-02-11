import { useEffect, useRef, useState } from "react";

import Map from "ol/Map";
import View from "ol/View";
import Overlay from "ol/Overlay";

import { Box, Typography } from "@mui/material";

import { mapInstanceAtom } from "../../atoms/mapAtoms.ts";
import { useAtom } from "jotai";

import MapHud from "./MapHud.tsx";

interface Props {
  children: React.ReactNode;
}

const MapContainer = ({ children }: Props) => {
  const [globalMapInstance, setGlobalMapInstance] = useAtom(mapInstanceAtom);

  const mapElement = useRef<HTMLDivElement>(null);
  const popupElement = useRef<HTMLDivElement>(null);

  const [currentTooltip, setCurrentTooltip] = useState<any>(null);

  useEffect(() => {
    if (!mapElement.current || !popupElement.current) return;

    const overlay = new Overlay({
      element: popupElement.current,
      autoPan: false,
    });

    const map = new Map({
      target: mapElement.current,
      overlays: [overlay],
      view: new View({
        center: [3874286.4007465374, 3670794.1879844004],
        zoom: 8,
      }),
      layers: [],
    });

    setGlobalMapInstance(map);

    return () => {
      map.setTarget(undefined);
      setGlobalMapInstance(null);
    };
  }, [setGlobalMapInstance]);

  useEffect(() => {
    if (!globalMapInstance || !popupElement.current) return;

    const overlay = new Overlay({
      element: popupElement.current,
      autoPan: false,
    });

    globalMapInstance.addOverlay(overlay);

    globalMapInstance.on("pointermove", (e) => {
      const feature = globalMapInstance.forEachFeatureAtPixel(
        e.pixel,
        (f) => f,
      );

      if (feature) {
        const tooltipContent = feature.get("tooltip");

        if (tooltipContent && popupElement.current) {
          setCurrentTooltip(tooltipContent);
          overlay.setPosition(e.coordinate);
          popupElement.current.style.display = "block";
          globalMapInstance.getTargetElement().style.cursor = "pointer";
          return;
        }
      }
      // no feature or no popupElement
      setCurrentTooltip(null);
      if (popupElement.current) popupElement.current.style.display = "none";
      globalMapInstance.getTargetElement().style.cursor = "";
    });
  }, [globalMapInstance]);

  return (
    <Box
      ref={mapElement}
      sx={{ width: "100%", height: "100%", position: "relative" }}
    >
      {globalMapInstance && children}

      <MapHud />

      <Box
        ref={popupElement}
        sx={{
          background: "white",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          display: "none",
          pointerEvents: "none",
          transform: "translate(-50%, -100%)",
          marginTop: "-10px",
        }}
      >
        <Box sx={{ display: currentTooltip ? "block" : "none" }}>
          <Typography variant="subtitle2" color="primary">
            <strong>{currentTooltip?.name}</strong>
          </Typography>
          <Typography variant="caption" display="block">
            Priority: {currentTooltip?.priority}
          </Typography>
          <Typography variant="caption" display="block">
            Date: {currentTooltip?.date}
          </Typography>
          <Typography variant="caption" display="block">
            Subject: {currentTooltip?.subject}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MapContainer;
