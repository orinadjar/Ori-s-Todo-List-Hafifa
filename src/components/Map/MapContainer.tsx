import { useEffect, useRef, useState } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';

import { Box, Typography } from '@mui/material';

import { MapContext } from './MapContext';

interface Props {
    children: React.ReactNode;
}

const MapContainer = ({ children }: Props) => {

    const mapElement = useRef<HTMLDivElement>(null);
    const popupElement = useRef<HTMLDivElement>(null);
    const [mapInstance, setMapInstance] = useState<Map | null>(null);

    const [currentTooltip, setCurrentTooltip] = useState<any>(null);

    useEffect(() => {
        if(!mapElement.current || !popupElement.current) return;

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

        map.on('pointermove', (e) => {
            const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);

            if(feature) {
                const tooltipContent = feature.get('tooltip');

                if(tooltipContent && popupElement.current){
                    setCurrentTooltip(tooltipContent);
                    overlay.setPosition(e.coordinate);
                    popupElement.current.style.display = 'block';
                    map.getTargetElement().style.cursor = 'pointer';
                    return;
                }
            }
            // no feature or no popupElement
            setCurrentTooltip(null);
            if(popupElement.current)
                popupElement.current.style.display = 'none';
            map.getTargetElement().style.cursor = '';
        });

        setMapInstance(map);
        return () => map.setTarget(undefined);

    }, [])

    return (
        <MapContext.Provider value={{ map: mapInstance }}>
            <Box ref={mapElement} sx={{ width: '100%', height: '100%', position: 'relative' }}>
                { mapInstance && children }
                
                <Box ref={popupElement} sx={{
                    background: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    display: 'none',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-10px'
                }}>

                    {currentTooltip && (
                        <Box>
                            <Typography variant="subtitle2" color="primary"><strong>{currentTooltip.name}</strong></Typography>
                            <Typography variant="caption" display="block">Priority: {currentTooltip.priority}</Typography>
                            <Typography variant="caption" display="block">Date: {currentTooltip.date}</Typography>
                            <Typography variant="caption" display="block">Subject: {currentTooltip.subject}</Typography>
                        </Box>
                    )}

                </Box>
            </Box>
        </MapContext.Provider>
    )
}

export default MapContainer