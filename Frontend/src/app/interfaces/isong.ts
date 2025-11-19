import { IArtist } from "./iartist"

export interface ISong {
    id: string
    name: string
    artists: Array<IArtist>
}
