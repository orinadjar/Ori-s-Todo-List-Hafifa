import { useEffect, useRef } from 'react'

import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import 'ol/ol.css';
import { Box } from '@mui/material';
import type { Todo } from '../types/types';

import selectorIcon  from '../assets/selector-icon.png';
import greenSelectorIcon from '../assets/green-selector-icon.png';

interface Props {
    onLocationSelect?: (coordinates: [number, number]) => void;
    todos?: Todo[];
}

const MapComponent = ({ onLocationSelect, todos = [] }: Props) => {
    const mapElement = useRef<HTMLDivElement>(null);
    const VectorSourceRef = useRef(new VectorSource()); // icons base

    useEffect(() => {
        if(!mapElement.current) return;

        const vectorLayer = new VectorLayer({
            source: VectorSourceRef.current,
        });

        const map = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer // math icons layer
            ],
            view: new View({
                center: [3874286.4007465374, 3670794.1879844004],
                zoom: 8,
            }),
        });

        map.on('click', (e) => {
            if (onLocationSelect && e.coordinate.length >= 2){
                const coords: [number, number] = [e.coordinate[0], e.coordinate[1]]
                onLocationSelect(coords);
            } 
        })

        return () => map.setTarget(undefined);

    }, [onLocationSelect]);

    useEffect(() => {

        VectorSourceRef.current.clear();

        const features = todos.filter(t => t.location).map((todo) => {
            const feature = new Feature({
                geometry: new Point(todo.location),
                name: todo.name,
            });

            feature.setStyle(new Style({
                image: new Icon({
                    src: todo.isCompleted ? greenSelectorIcon : selectorIcon,
                    scale: 0.07
                }),
                
            }));

            return feature;
        });

        VectorSourceRef.current.addFeatures(features);
    }, [todos]);

    return (
        <Box ref={mapElement} sx={{ width: '100%', height: '100%',  backgroundColor: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
            
        </Box>
    )
}

export default MapComponent