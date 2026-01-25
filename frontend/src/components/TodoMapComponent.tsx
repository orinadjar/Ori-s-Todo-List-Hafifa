import { useEffect, useRef } from 'react'

import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Fill, Stroke } from 'ol/style';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';

import 'ol/ol.css';
import { Box } from '@mui/material';
import type { Todo, TodoGeometryType } from '../types/types';

import selectorIcon  from '../assets/selector-icon.png';
import greenSelectorIcon from '../assets/green-selector-icon.png';

interface Props {
    onLocationSelect?: (coordinates: [number, number] | null) => void;
    onPolygonSelect?: (coordinates: number[][][] | null) => void
    todos?: Todo[];
    mode?: TodoGeometryType
}

const MapComponent = ({ onLocationSelect, onPolygonSelect, todos = [], mode }: Props) => {
    const mapElement = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
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
                center: [3870552.51, 3662616.19],
                zoom: 6,
            }),
        });

        mapRef.current = map;

        return () => {
            mapRef.current = null;
            map.setTarget(undefined);
        }

    }, []);

    useEffect(() => {

        const map = mapRef.current;
        if(!map) return;

        if(mode === 'Point'){
            const clickHandler = (e: any) => {
                if (onLocationSelect) {
                    onLocationSelect([e.coordinate[0], e.coordinate[1]]);
                    if (onPolygonSelect) onPolygonSelect(null); 
                }
            };

            map.on('click', clickHandler);

            return () => map.un('click', clickHandler);   
        } else {
            const draw = new Draw({
                source: VectorSourceRef.current,
                type: 'Polygon',
            });

            draw.on('drawend', (e) => {
                const geometry = e.feature.getGeometry() as Polygon;

                if(onPolygonSelect) {
                    onPolygonSelect(geometry.getCoordinates());
                    if(onLocationSelect) onLocationSelect(null);
                }
            });

            map.addInteraction(draw);

            return () => map.removeInteraction(draw);
        }

    }, [mode, onLocationSelect, onPolygonSelect]);

    useEffect(() => {

        VectorSourceRef.current.clear();

        const features = todos.map((todo) => {
            let feature: Feature;

            if(todo.geometryType === 'Polygon' && todo.coordinates ) {
                console.log(todo);
                feature = new Feature({
                    geometry: new Polygon(todo.coordinates),
                    name: todo.name
                });

                feature.setStyle(new Style({
                    stroke: new Stroke({ color: '#3f51b5', width: 3 }),
                    fill: new Fill({ color: 'rgba(63, 81, 181, 0.2)' }),
                }));
            } else {
                feature = new Feature({
                    geometry: new Point([todo.lat, todo.lng]),
                    name: todo.name,
                 });

                feature.setStyle(new Style({
                    image: new Icon({
                        src: todo.isCompleted ? greenSelectorIcon : selectorIcon,
                        scale: 0.07
                    }),
                    
                }));
            }

            return feature;
        });

        VectorSourceRef.current.addFeatures(features);

    }, [todos])

    return (
        <Box ref={mapElement} sx={{ width: '100%', height: '100%',  backgroundColor: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
            
        </Box>
    )
}

export default MapComponent