import { useEffect, useRef } from 'react';

import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon, Stroke, Fill } from 'ol/style';

import { mapInstanceAtom } from '../../../atoms/mapAtoms';
import { useAtomValue } from 'jotai';

interface GeoJsonLayerProps {
  name: string; 
  data: any; 
  zIndex: number;
  tooltipField?: string;
}

const GeoJsonLayer = ({ name, data, zIndex, tooltipField }: GeoJsonLayerProps) => {

  const map = useAtomValue(mapInstanceAtom);

  const sourceRef = useRef(new VectorSource()); // the warehouse of the data, stores the features
  const layerRef = useRef(new VectorLayer({ // decide how to show the data (colors, opacity ...)
    source: sourceRef.current,
    zIndex: zIndex,
    properties: { name }
  }));

  useEffect(() => {
    if(!data) return;
    sourceRef.current.clear();

    const features = new GeoJSON().readFeatures(data);
    
    features.forEach((feature) => {
      if(tooltipField) {
        const content = feature.get(tooltipField);
        feature.set('tooltip', content);
      }

      if(feature.getGeometry()?.getType() === 'Polygon'){
        feature.setStyle(new Style({
            stroke: new Stroke({ color: '#3f51b5', width: 3 }),
            fill: new Fill({ color: 'rgba(63, 81, 181, 0.2)' }),
        }));
      }

      if(feature.getProperties().icon){
        feature.setStyle(new Style({
          image: new Icon({
            src: feature.getProperties().icon,
            scale: 0.07
          })
        }));
      }
    })

    sourceRef.current.addFeatures(features);
  }, [tooltipField, data])

  useEffect(() => {
    if(!map) return;
    
    map.addLayer(layerRef.current);

    return () => {
      map.removeLayer(layerRef.current);
    }

  }, [map]);

  return null;
}

export default GeoJsonLayer