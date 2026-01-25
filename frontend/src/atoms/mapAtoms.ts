import { atom } from 'jotai';

import Map from 'ol/Map';

export const mapInstanceAtom = atom<Map | null>(null);