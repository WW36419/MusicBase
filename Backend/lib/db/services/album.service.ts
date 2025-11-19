import Database from "../database";
import { config } from "../../config";
import { ParsedQs } from "qs";
import { IAlbum } from "../models/album.model";
import { IRelease } from "../models/release.model";

class AlbumService {
    private db: Database

    constructor() {
        this.db = new Database(config.db_info)
    }

    public async searchAlbum(phrase: string | ParsedQs | (string | ParsedQs)[]) {
        try {
            const query = "SELECT album_id, name, artists FROM music.albums WHERE name ILIKE $1 ORDER BY popularity DESC LIMIT 3";
            const result = await this.db.queryWithParams(query, [phrase+'%'])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w searchArtist(): ${error}`)
        }
    }

    public async albumDetails(album_id: string) {
        try {
            const query = "SELECT * FROM music.albums WHERE album_id = $1";
            const result = await this.db.queryWithParams(query, [album_id])
            return result.rows[0]
        } catch (error) {
            throw new Error(`Wystąpił błąd w albumDetails(): ${error}`)
        }
    }

    public async albumsFromArtist(artist_id: string) {
        try {
            const query = "SELECT album_id, name, release_date FROM music.albums NATURAL JOIN music.releases WHERE artist_id = $1 ORDER BY release_date";
            const result = await this.db.queryWithParams(query, [artist_id])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w albumsFromArtist(): ${error}`)
        }
    }


    public async addAlbum(album: IAlbum) {
        try {
            const query = "INSERT INTO music.albums (name, billboard, artists, popularity, total_tracks, album_type, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING album_id";
            const result = await this.db.queryWithParams(query, [album.name, album.billboard, album.artists, album.popularity, album.total_tracks, album.type, album.image_url])
            return result.rows[0]
        } catch (error) {
            throw new Error(`Wystąpił błąd w addAlbum(): ${error}`)
        }
    }

    public async addRelease(release: IRelease, album_id: string) {
        try {
            const query = "INSERT INTO music.releases VALUES ($1, $2, $3, $4)";
            const result = await this.db.queryWithParams(query, [release.artist_id, album_id, release.date, release.date_precision])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w addAlbum(): ${error}`)
        }
    }

    public async updateTrack(track_nr: number, album_id: string, song_id: string) {
        try {
            const query = "UPDATE music.tracks SET (track_number, album_id) = ($1, $2) WHERE song_id = $3";
            const result = await this.db.queryWithParams(query, [track_nr, album_id, song_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w addAlbum(): ${error}`)
        }
    }


    public async deleteAlbum(album_id: string) {
        try {
            const query = "DELETE FROM music.albums WHERE album_id = $1";
            const result = await this.db.queryWithParams(query, [album_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteAlbum(): ${error}`)
        }
    }

    public async deleteRelease(album_id: string) {
        try {
            const query = "DELETE FROM music.releases WHERE album_id = $1";
            const result = await this.db.queryWithParams(query, [album_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteRelease(): ${error}`)
        }
    }

    public async clearAlbumFromTracks(album_id: string) {
        try {
            const query1 = "SELECT * FROM music.tracks WHERE album_id = $1";
            const result1 = await this.db.queryWithParams(query1, [album_id])

            if (result1.rowCount > 0) {
                const query2 = "UPDATE music.tracks SET album_id = 'none' WHERE album_id = $1";
                const result2 = await this.db.queryWithParams(query2, [album_id])
                return (result2.rowCount > 0)
            } else
                return false
                
        } catch (error) {
            throw new Error(`Wystąpił błąd w clearAlbumFromTracks(): ${error}`)
        }
    }

} export default AlbumService