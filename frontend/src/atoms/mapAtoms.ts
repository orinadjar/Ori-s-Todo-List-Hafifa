import { atom } from 'jotai';

export const isSearchGeometryAtom = atom<boolean>(false);
export const searchGeoJsonAtom = atom<string | null>(null);