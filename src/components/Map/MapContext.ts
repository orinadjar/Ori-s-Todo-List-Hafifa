import { createContext, useContext } from "react";

import Map from "ol/Map";

export interface MapContextProps{
  map: Map | null;
}

export const MapContext = createContext<MapContextProps | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);

  if(context === undefined){
    throw new Error('map context is undifined');
  }

  return context;
}