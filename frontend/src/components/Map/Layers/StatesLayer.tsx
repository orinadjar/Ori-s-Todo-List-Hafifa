import { useEffect } from "react";

import GeoJSON from "ol/format/GeoJSON";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

import { mapInstanceAtom } from "../../../atoms/mapAtoms";
import { useAtomValue } from "jotai";

import statesJson from "../../../../states.json";

const StatesLayer = () => {
  const map = useAtomValue(mapInstanceAtom);
  useEffect(() => {
    if (!map) return;

    const states = new GeoJSON().readFeatures(statesJson, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    const newSource = new VectorSource({
      features: states,
    });

    const newLayer = new VectorLayer({
      source: newSource,
      zIndex: 1,
      properties: { name: "States Layer" },
    });

    map.addLayer(newLayer);

    return () => {
      map.removeLayer(newLayer);
    };
  }, [map]);

  return null;
};

export default StatesLayer;
