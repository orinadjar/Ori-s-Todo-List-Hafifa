import { useEffect, useRef } from 'react';

import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon } from 'ol/style';

import { useMap } from '../MapContext';

interface GeoJsonLayerProps {
  name: string; // layer name for HUD
  data: any; // the data in GeoJson format
  iconSrc?: string;
}

const GeoJsonLayer = ({ name, data, iconSrc }: GeoJsonLayerProps) => {

  const { map } = useMap();

  const sourceRef = useRef(new VectorSource()); // the warehouse of the data, stores the features
  const layerRef = useRef(new VectorLayer({ // decide how to show the data (colors, opacity ...)
    source: sourceRef.current,
    properties: { name }
  }));

  useEffect(() => {
    if(!map) return;
    
    map.addLayer(layerRef.current);

    return () => {
      map.removeLayer(layerRef.current);
    }

  }, [map]);

  useEffect(() => {
    if(!data) return;

    sourceRef.current.clear();

    const features = new GeoJSON().readFeatures(data);

    features.forEach((feature) => {
      feature.setStyle(new Style({
        image: new Icon({
          src: feature.getProperties().icon ?? null,
          scale: 0.07
        })
      }));
    });

    sourceRef.current.addFeatures(features);

  }, [data, iconSrc])

  return null;
}

export default GeoJsonLayer