import { useEffect } from "react";

import { useAtomValue, useSetAtom } from "jotai";
import {
  isDrawingAtom,
  searchGeoJsonAtom,
} from "../../../atoms/mapAtoms";

import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import Draw from "ol/interaction/Draw";
import GeoJSON from "ol/format/GeoJSON";

import { useMap } from "../MapContext";

const SearchGeoLayer = () => {
  const setSearchGeoJson = useSetAtom(searchGeoJsonAtom);
  const isDrawing = useAtomValue(isDrawingAtom);
  
  const { map } = useMap();

  useEffect(() => {
    if (!map || !isDrawing) return;

    const source = new VectorSource();
    const drawLayer = new VectorLayer({
      source,
      style: new Style({
        stroke: new Stroke({ color: "#ff9800", width: 3, lineDash: [4, 8] }),
        fill: new Fill({ color: "rgba(255, 152, 0, 0.2)" }),
      }),
    });

    map.addLayer(drawLayer);

    const draw = new Draw({
      source,
      type: "Polygon",
    });

    draw.on("drawend", (event) => {
      const format = new GeoJSON();
      const geoJsonStr = format.writeGeometry(event.feature.getGeometry()!);

      setSearchGeoJson(geoJsonStr);
    });

    map.addInteraction(draw);

    return () => {
      setSearchGeoJson("");
      map.removeLayer(drawLayer);
      map.removeInteraction(draw);
    };
  }, [map, setSearchGeoJson, isDrawing]);

  return null;
};

export default SearchGeoLayer;
