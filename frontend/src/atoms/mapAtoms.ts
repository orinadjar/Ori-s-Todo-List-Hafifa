import { atom } from 'jotai';

export const searchGeoJsonAtom = atom<string | null>(null);
export const isSearchGeometryAtom = atom<boolean>(false);