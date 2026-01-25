import { useEffect } from "react"

import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"

import { mapInstanceAtom } from "../../../atoms/mapAtoms"
import { useAtomValue } from "jotai"

const BaseLayer = () => {

    const map  = useAtomValue(mapInstanceAtom);

    useEffect(() => {
        if (!map) return;

        const tileLayer = new TileLayer({
            source: new OSM(),
            zIndex: 0,
            properties: { 
                name: "Base Map"
            },
        });

        map.addLayer(tileLayer);

        return () => {
            map.removeLayer(tileLayer);
        }
    }, [map]);

    return null;
}

export default BaseLayer