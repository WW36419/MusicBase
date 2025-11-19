import Database from "../database";
import { config } from "../../config";
import { ISong } from "../models/song.model";
import { ITrack } from "../models/track.model";
import { IFavouriteSong } from "../models/favourite-song.model";

class SongService {
    private db: Database

    constructor() {
        this.db = new Database(config.db_info)
    }

    public async getTop10AllSongs() {
        try {
            const query = "SELECT song_id, song_name, artists, explicit, album_id FROM music.songs NATURAL JOIN music.tracks ORDER BY popularity DESC LIMIT 10";
            const result = await this.db.query(query)
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w getTop10AllSongs(): ${error}`)
        }
    }

    public async searchSongs(phrase: any) {
        try {
            const query = "SELECT song_id, song_name, artists FROM music.songs WHERE song_name ILIKE $1 ORDER BY popularity DESC LIMIT 3";
            const result = await this.db.queryWithParams(query, [phrase+'%'])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w searchSongs(): ${error}`)
        }
    }

    public async songDetails(song_id: string) {
        try {
            const query = "SELECT * FROM music.songs NATURAL JOIN music.tracks WHERE song_id = $1";
            const result = await this.db.queryWithParams(query, [song_id])
            return result.rows[0]
        } catch (error) {
            throw new Error(`Wystąpił błąd w songDetails(): ${error}`)
        }
    }

    public async songsFromAlbum(album_id: string) {
        try {
            const query = "SELECT track_number, song_id, song_name FROM music.tracks NATURAL JOIN music.songs WHERE album_id = $1 ORDER BY track_number";
            const result = await this.db.queryWithParams(query, [album_id])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w songsFromAlbum(): ${error}`)
        }
    }

    public async songsFromArtist(artist_id: string) {
        try {
            const query = "SELECT song_id, song_name FROM music.songs NATURAL JOIN music.tracks WHERE artists ILIKE $1 ORDER BY popularity DESC";
            const result = await this.db.queryWithParams(query, ['%'+artist_id+'%'])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w songsFromArtist(): ${error}`)
        }
    }

    public async favouriteSongs(user_id: string) {
        try {
            const query = "SELECT song_id, song_name, artists, explicit, album_id FROM music.songs NATURAL JOIN music.tracks NATURAL JOIN userbase.favourites WHERE user_id = $1";
            const result = await this.db.queryWithParams(query, [user_id])
            return result.rows
        } catch (error) {
            throw new Error(`Wystąpił błąd w favouriteSongs(): ${error}`)
        }
    }

    public async checkFavouriteSong(user_id: string, song_id: string) {
        try {
            const query = "SELECT * FROM userbase.favourites WHERE user_id = $1 AND song_id = $2";
            const result = await this.db.queryWithParams(query, [user_id, song_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w favouriteSongs(): ${error}`)
        }
    }


    public async addSong(song: ISong) {
        try {
            const query = "INSERT INTO music.songs (song_name, billboard, artists, popularity, explicit, song_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING song_id";
            const result = await this.db.queryWithParams(query, [song.name, song.billboard, song.artists, song.popularity, song.explicit, song.type])
            return result.rows[0]
        } catch (error) {
            throw new Error(`Wystąpił błąd w addSong(): ${error}`)
        }
    }

    public async addTrack(track: ITrack, song_id: string) {
        try {
            const query = "INSERT INTO music.tracks VALUES ($1, $2, $3, $4, $5)";
            const result = await this.db.queryWithParams(query, [song_id, track.album_id, track.track_number, track.release_date, track.release_date_precision])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w addTrack(): ${error}`)
        }
    }

    public async addSongToFavourites(fav_song: IFavouriteSong) {
        try {
            const query = "INSERT INTO userbase.favourites VALUES($1, $2)";
            const result = await this.db.queryWithParams(query, [fav_song.user_id, fav_song.song_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w addSongToFavourites(): ${error}`)
        }
    }


    public async deleteSong(song_id: string) {
        try {
            const query = "DELETE FROM music.songs WHERE song_id = $1";
            const result = await this.db.queryWithParams(query, [song_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteSong(): ${error}`)
        }
    }

    public async deleteTrack(song_id: string) {
        try {
            const query = "DELETE FROM music.tracks WHERE song_id = $1";
            const result = await this.db.queryWithParams(query, [song_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteTrack(): ${error}`)
        }
    }

    public async deleteFromPlaylists(song_id: string) {
        try {
            const query1 = "SELECT * FROM userbase.playlist_songs WHERE song_id = $1";
            const result1 = await this.db.queryWithParams(query1, [song_id])

            if (result1.rowCount > 0) {
                const query2 = "DELETE FROM userbase.playlist_songs WHERE song_id = $1";
                const result2 = await this.db.queryWithParams(query2, [song_id])
                return (result2.rowCount > 0)
            } else
                return false
                
        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteFromPlaylists(): ${error}`)
        }
    }

    public async deleteFavourites(song_id: string) {
        try {
            const query1 = "SELECT * FROM userbase.favourites WHERE song_id = $1";
            const result1 = await this.db.queryWithParams(query1, [song_id])

            if (result1.rowCount > 0) {
                const query2 = "DELETE FROM userbase.favourites WHERE song_id = $1";
                const result2 = await this.db.queryWithParams(query2, [song_id])
                return (result2.rowCount > 0)
            } else
                return false

        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteFavourites(): ${error}`)
        }
    }

    public async deleteFavouriteSong(fav_song: IFavouriteSong) {
        try {
            const query = "DELETE FROM userbase.favourites WHERE user_id = $1 AND song_id = $2";
            const result = await this.db.queryWithParams(query, [fav_song.user_id, fav_song.song_id])
            return (result.rowCount > 0)
        } catch (error) {
            throw new Error(`Wystąpił błąd w deleteFavouriteSong(): ${error}`)
        }
    }

} export default SongService