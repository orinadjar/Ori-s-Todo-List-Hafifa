import { useEffect, useState } from "react";

import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon } from "ol/style";

import { useAtomValue } from 'jotai';
import { mapInstanceAtom } from "../../../atoms/mapAtoms";

interface GeoJsonLayerProps {
  name: string;
  data: unknown;
  zIndex: number;
  tooltipField?: string;
}

const GeoJsonLayer = ({
  name,
  data,
  zIndex,
  tooltipField,
}: GeoJsonLayerProps) => {
  const map = useAtomValue(mapInstanceAtom);
  const [layer, setLayer] = useState<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!data) return;

    if (typeof data === "object") {
      const features = new GeoJSON().readFeatures(data);

      features.forEach((feature) => {
        if (tooltipField) {
          const content = feature.get(tooltipField);
          feature.set("tooltip", content);
        }

        if (feature.getProperties().icon) {
          feature.setStyle(
            new Style({
              image: new Icon({
                src: feature.getProperties().icon,
                scale: 0.07,
              }),
            }),
          );
        }
      });

      const newSource = new VectorSource({
        features: features,
      });

      const newLayer = new VectorLayer({
        source: newSource,
        zIndex: zIndex,
        properties: { name }
      });

      setLayer(newLayer);
    }
  }, [tooltipField, data, name, zIndex]);

  useEffect(() => {
    if (!map || !layer) return;

    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, layer]);

  return null;
};

export default GeoJsonLayer;