import { useEffect, useRef } from "react";

import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { mapInstanceAtom } from "../../../atoms/mapAtoms";
import { useAtomValue } from "jotai";

import statesJson from '../../../../states.json';

const StatesLayer = () => {

    const map = useAtomValue(mapInstanceAtom);

    const sourceRef = useRef(new VectorSource());
    const layerRef = useRef(new VectorLayer({
        source: sourceRef.current,
        zIndex: 1,
        properties: {name: "States Layer"}
    }));

    useEffect(() => {
        if(!map) return;

        sourceRef.current.clear();

        const states = new GeoJSON().readFeatures(statesJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });

        sourceRef.current.addFeatures(states);

        map.addLayer(layerRef.current);

        return () => {
            map.removeLayer(layerRef.current);
        }
    }, [map]);

    return null;
}

export default StatesLayer
