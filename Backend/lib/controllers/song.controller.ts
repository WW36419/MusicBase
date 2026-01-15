import Controller from "lib/interfaces/controller.interface";
import { Request, Response, Router } from 'express';
import { auth } from "../middlewares/auth.middleware";
import SongService from "../db/services/song.service";
import Joi from "joi";


class SongController implements Controller {
    public path = '/api/song'
    public router = Router()
    public songService = new SongService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}s/top10/all`, this.getTop10All)
        this.router.get(`${this.path}s/search`, this.searchSongs)
        this.router.get(`${this.path}s/from_album/:id`, this.getSongsFromAlbum)
        this.router.get(`${this.path}s/from_artist/:id`, this.getSongsFromArtist)
        this.router.get(`${this.path}s/favourites/user/:id`, auth, this.getFavouriteSongs)
        this.router.get(`${this.path}/:id`, this.getSongDetails)
        this.router.get(`${this.path}/check/:id`, this.checkSongID)
        this.router.get(`${this.path}/favourites/check/:song_id/user/:user_id`, this.checkFavouriteSong)

        this.router.post(`${this.path}/add`, this.addSong)
        this.router.post(`${this.path}/to_favourites`, this.addFavouriteSong)

        this.router.delete(`${this.path}/del`, this.delSong)
        this.router.delete(`${this.path}/from_favourites`, this.delFavouriteSong)
    }

    private getTop10All = async (request: Request, response: Response) => {
        const data = await this.songService.getTop10AllSongs();
        response.status(200).json(data)
    }

    private searchSongs = async (request: Request, response: Response) => {
        let phrase = request.query.q
        if (phrase != null) {
            const data = await this.songService.searchSongs(phrase);
            response.status(200).json(data)
        } else 
            response.status(400).json({"error": "No query!"})
    }

    private getSongDetails = async (request: Request, response: Response) => {
        let song_id = request.params.id
        if (song_id != null) {
            const data = await this.songService.songDetails(song_id);
            response.status(200).json(data)
        } else
            response.status(400).json({"error": "Invalid song ID!"})
    }

    private checkSongID = async (request: Request, response: Response) => {
        let song_id = request.params.id
        if (song_id != null) {
            const data = await this.songService.songDetails(song_id);
            if (data != null)
                response.status(200).json({"check": true})
            else
                response.status(200).json({"check": false})
        } else
            response.status(400).json({"error": "No song ID!"})
    }

    private getSongsFromAlbum = async (request: Request, response: Response) => {
        let album_id = request.params.id
        if (album_id != null) {
            const data = await this.songService.songsFromAlbum(album_id);
            response.status(200).json(data)
        } else
            response.status(400).json({"error": "No song ID!"})
    }

    private getSongsFromArtist = async (request: Request, response: Response) => {
        let artist_id = request.params.id
        if (artist_id != null) {
            const data = await this.songService.songsFromArtist(artist_id);
            response.status(200).json(data)
        } else
            response.status(400).json({"error": "No song ID!"})
    }

    private getFavouriteSongs = async (request: Request, response: Response) => {
        let user_id = request.params.id
        if (user_id != null) {
            const data = await this.songService.favouriteSongs(user_id);
            response.status(200).json(data)
        } else
            response.status(400).json({"error": "No user ID!"})
    }

    private checkFavouriteSong = async (request: Request, response: Response) => {
        let user_id = request.params.user_id
        let song_id = request.params.song_id
        if (user_id !== null && song_id !== null) {
            const result = await this.songService.checkFavouriteSong(user_id, song_id)
            if (result)
                response.status(200).json({"msg": "OK"});
            else
                response.status(200).json({"msg": "No song in favourites!"});
        } else
            response.status(400).json({"error": "No user ID or song ID!"})
    }


    private addSong = async (request: Request, response: Response) => {
        const {name, billboard, artists, popularity, explicit, type, album_id, track_number, release_date, release_date_precision} = request.body;
        const song_schema = Joi.object({
            name: Joi.string().required(),
            billboard: Joi.string().required(),
            artists: Joi.string().required(),
            popularity: Joi.number().required(),
            explicit: Joi.string().required(),
            type: Joi.string().required()
        })
        const track_schema = Joi.object({
            album_id: Joi.string().required(),
            track_number: Joi.number().required(),
            release_date: Joi.string().required(),
            release_date_precision: Joi.string().required()
        })

        try {
            const song = await song_schema.validateAsync({name, billboard, artists, popularity, explicit, type})
            const track = await track_schema.validateAsync({album_id, track_number, release_date, release_date_precision})
            const song_result = await this.songService.addSong(song)
            if (song_result !== null) {
                const song_id = song_result.song_id
                const track_result = await this.songService.addTrack(track, song_id)
                if (track_result)
                    response.status(200).json({"msg": "OK", "song_id": song_id});
                else
                    response.status(400).json({"msg": "Adding trach to DB failed!", "song_id": song_id});
            } else
                response.status(400).json({"msg": "Adding song to DB failed!"});

        } catch (error) {
            console.error(`Validation Error: ${error}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }

    private addFavouriteSong = async (request: Request, response: Response) => {
        const {user_id, song_id} = request.body;
        const schema = Joi.object({
            user_id: Joi.string().required(),
            song_id: Joi.string().required()
        })

        try {
            const favourite_song = await schema.validateAsync({user_id, song_id})
            const result = await this.songService.addSongToFavourites(favourite_song)
            if (result)
                response.status(200).json({"msg": "OK"});
            else
                response.status(400).json({"msg": "Adding favourite song failed!"});
        } catch (error) {
            console.error(`Validation Error: ${error}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }


    private delSong = async (request: Request, response: Response) => {
        const {song_id} = request.body
        if (song_id !== null) {
            const result1 = await this.songService.deleteSong(song_id)
            const result2 = await this.songService.deleteTrack(song_id)
            if (result1 && result2) {
                const result3 = await this.songService.deleteFavourites(song_id)
                const result4 = await this.songService.deleteFromPlaylists(song_id)
                response.status(200).json({
                    "msg": "OK",
                    "del_song": result1,
                    "del_track": result2,
                    "del_favoutites": result3,
                    "del_from_playlists": result4
                });
            } else
                response.status(400).json({
                    "msg": "Deleting songs from DB failed!",
                    "del_song": result1,
                    "del_track": result2
                });
        } else 
            response.status(400).json({"error": "No song ID!"})
    }

    private delFavouriteSong = async (request: Request, response: Response) => {
        const {user_id, song_id} = request.body;
        const schema = Joi.object({
            user_id: Joi.string().required(),
            song_id: Joi.string().required()
        })

        try {
            const favourite_song = await schema.validateAsync({user_id, song_id})
            const result = await this.songService.deleteFavouriteSong(favourite_song)
            if (result)
                response.status(200).json({"msg": "OK"});
            else
                response.status(400).json({"msg": "Deleting favourite song failed!"});
        } catch (error) {
            console.error(`Validation Error: ${error}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }

} export default SongController