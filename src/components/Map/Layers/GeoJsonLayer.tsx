import { useEffect, useRef, useState } from "react";

import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon } from "ol/style";

import { useMap } from "../MapContext";

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
  const { map } = useMap();

  const [source, setSource] = useState<VectorSource | null>(null);
  const [layer, setLayer] = useState<VectorLayer<VectorSource> | null>(null)

  useEffect(() => {
    const newSource = new VectorSource();
    const newLayer = new VectorLayer({
      source: newSource,
      zIndex: zIndex,
      properties: { name }
    })

    setSource(newSource);
    setLayer(newLayer);

    return () => {
      if(map) map.removeLayer(newLayer);
    }
  }, [map, name, zIndex])

  useEffect(() => {
    if (!data || !source) return;

    source.clear();

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

      source.addFeatures(features);
    }
  }, [tooltipField, data, name, zIndex, source]);

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
