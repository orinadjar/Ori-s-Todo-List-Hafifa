import { atom } from 'jotai';

import Map from 'ol/Map';

export const mapInstanceAtom = atom<Map | null>(null);

export const isSearchGeometryAtom = atom<boolean>(false);
export const searchGeoJsonAtom = atom<string | null>(null);