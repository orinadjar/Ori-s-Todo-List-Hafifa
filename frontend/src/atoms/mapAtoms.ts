import { atom } from 'jotai';

export const searchGeoJsonAtom = atom<string | null>(null);
export const isDrawingAtom = atom<boolean>(false);