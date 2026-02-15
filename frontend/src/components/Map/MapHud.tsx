import { useEffect, useState } from "react"

import { Button, Checkbox, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material";

import { isSearchGeometryAtom} from "../../atoms/mapAtoms";
import { useAtom } from "jotai";

import { Layer } from 'ol/layer';

import CoordsPanel from "../CoordsPanel";
import { useMap } from "./MapContext";

const MapHud = () => {

    const { map } = useMap();
    const [isSearchGeometry, setIsSearchGeometry] = useAtom(isSearchGeometryAtom);

    const [layers, setLayers] = useState<Layer[]>([]);
    const [visibleLayers, setVisibleLayers] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!map) return;

        const updateLayers = () => {
            const allLayers = map.getAllLayers();
            setLayers([...allLayers]);

            const layersVisibleInfo: {
                [key: string]: boolean
            } = {};

            allLayers.forEach(layer => {
                const name = layer.get('name');
                if (name)
                    layersVisibleInfo[name] = layer.getVisible();
            })

            setVisibleLayers(layersVisibleInfo);
        }

        updateLayers();
        map.getLayers().on('change:length', updateLayers);

    }, [map]);

    const handleToggle = (layer: Layer) => {
        const name = layer.get('name');
        const nextVisible = !layer.getVisible();
        layer.setVisible(nextVisible);
        setVisibleLayers(prev => ({ ...prev, [name]: nextVisible }));
    }

    return (
        <>
            <Paper sx={{ position: "absolute", minWidth: 150, borderRadius: 2, zIndex: 1000, ml: 5, mt: 1 }} style={{ boxShadow: '-2px 8px 9px rgba(2, 2, 2, 0.2)'  }}>
                <FormGroup>
                    {layers.map((layer, index) => {
                        const name = layer.get('name');
                        if (!name) return null;

                        return (
                            <FormControlLabel key={index} control={
                                <Checkbox size='small' checked={visibleLayers[name] ?? true} onChange={() => handleToggle(layer)}  />
                            } label={<Typography>{name}</Typography>} sx={{ m: 0, py: 0.2, borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }} />

                        )
                    })}

                    <Button sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" onClick={() => setIsSearchGeometry(!isSearchGeometry)}>
                        {isSearchGeometry ? 'searching by area' : 'click to search by area'}
                    </Button>
                </FormGroup>
            </Paper>

            <CoordsPanel />
        </>
    )
}

export default MapHud
