import { ISong } from "./isong";

export interface ISongCard extends ISong {
    explicit: string,
    album_id: string
}
