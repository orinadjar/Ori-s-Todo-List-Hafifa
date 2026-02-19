import { useEffect, useRef } from "react";

import Map from "ol/Map";
import Overlay from "ol/Overlay";

interface Tooltip {
  name: string;
  priority: string;
  date: string;
  subject: string;
}

const tooltipToHtml = (t: Tooltip) =>
  `<div style="font-weight: 700;">${t.name}</div>` +
  `<div style="font-size: 15px; display: block;">Priority: ${t.priority}</div>` +
  `<div style="font-size: 15px; display: block;">Date: ${t.date}</div>` +
  `<div style="font-size: 15px; display: block;">Subject: ${t.subject}</div>`;

interface TooltipOverlayProps {
  map: Map | null;
}

const TooltipOverlay = ({ map }: TooltipOverlayProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!map || !element) return;

    const overlay = new Overlay({
      element,
      autoPan: false,
    });

    map.addOverlay(overlay);


    const handlePointerMove = (e: any) => {
      const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);

      if (!feature) {
        element.innerHTML = "";
        element.style.display = "none";
        overlay.setPosition(undefined);
        map.getTargetElement().style.cursor = "";
        return;
      }

      const tooltipContent = feature.get("tooltip") as Tooltip | undefined;

      if (tooltipContent) {
        element.innerHTML = tooltipToHtml(tooltipContent);
        element.style.display = "block";
        overlay.setPosition(e.coordinate);
        map.getTargetElement().style.cursor = "pointer";
      }
    };

    map.on("pointermove", handlePointerMove);

    return () => {
      map.un("pointermove", handlePointerMove);
      map.removeOverlay(overlay);
    };
  }, [map]);

  return (
    <div
      ref={elementRef}
      style={{
        background: "white",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        display: "none",
        pointerEvents: "none",
        transform: "translate(-50%, -100%)",
        marginTop: "-10px",
      }}
    />
  );
};

export default TooltipOverlay;
