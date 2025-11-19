import Database from "../database";
import { config } from "../../config";
import { ParsedQs } from "qs";
import { IArtist } from "../models/artist.model";

class SongService {
    private db: Database

    constructor() {
        this.db = new Database(config.db_info)
    }

    public async searchArtist(phrase: string | ParsedQs | (string | ParsedQs)[]) {
        try {
            const query = "SELECT artist_id, name, main_genre, image_url FROM music.artists WHERE name ILIKE $1 ORDER BY popularity DESC LIMIT 3";
            const result = await this.db.queryWithParams(query, ['%'+phrase+'%'])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w searchArtist(): ${error}`)
        }
    }

    public async artistDetails(artist_id: string) {
        try {
            const query = "SELECT * FROM music.artists WHERE artist_id = $1";
            const result = await this.db.queryWithParams(query, [artist_id])
            return result.rows[0]
        } catch (error) {
            throw new Error(`Wystąpił błąd w artistDetails(): ${error}`)
        }
    }

    public async artistsFromAlbum(album_id: string) {
        try {
            const query = "SELECT artist_id, name, main_genre, image_url FROM music.artists NATURAL JOIN music.releases WHERE album_id = $1 ORDER BY name";
            const result = await this.db.queryWithParams(query, [album_id])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w albumsFromArtist(): ${error}`)
        }
    }


    public async addArtist(artist: IArtist) {
        try {
            const query = "INSERT INTO music.artists (name, followers, popularity, artist_type, main_genre, genres, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING artist_id";
            const result = await this.db.queryWithParams(query, [artist.name, artist.followers, artist.popularity, artist.type, artist.main_genre, artist.genres, artist.image_url])
            return result.rows[0]
        } catch (error) {
            throw new Error(`Wystąpił błąd w addArtist(): ${error}`)
        }
    }

    public async deleteArtist(artist_id: string) {
        try {
            const query = "DELETE FROM music.artists WHERE artist_id = $1";
            const result = await this.db.queryWithParams(query, [artist_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteArtist(): ${error}`)
        }
    }

} export default SongService