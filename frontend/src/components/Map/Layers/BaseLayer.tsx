import { useEffect } from "react"

import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"

import { useMap } from "../MapContext"

const BaseLayer = () => {

    const  {map }  = useMap();

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