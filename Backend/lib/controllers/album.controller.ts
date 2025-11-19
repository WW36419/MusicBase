import Controller from "lib/interfaces/controller.interface";
import { Request, Response, Router } from 'express';
import Joi from "joi";
import AlbumService from "../db/services/album.service";


class AlbumController implements Controller {
    public path = '/api/album'
    public router = Router()
    public albumService = new AlbumService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}s/search`, this.searchAlbums)
        this.router.get(`${this.path}s/from_artist/:id`, this.getAlbumsFromArtist)
        this.router.get(`${this.path}/:id`, this.getAlbumDetails)
        this.router.get(`${this.path}/check/:id`, this.checkAlbumId)
        this.router.get(`${this.path}/image/:id`, this.getAlbumImage)
        this.router.get(`${this.path}/name/:id`, this.getAlbumName)

        this.router.post(`${this.path}/add`, this.addAlbum)
        this.router.delete(`${this.path}/del`, this.delAlbum)
    }

    private searchAlbums = async (request: Request, response: Response) => {
        let phrase = request.query.q
        if (phrase != null) {
            const data = await this.albumService.searchAlbum(phrase);
            response.status(200).json(data)
        } else 
            response.status(400).json({"error": "No query!"})
    }

    private getAlbumDetails = async (request: Request, response: Response) => {
        let album_id = request.params.id
        if (album_id != null) {
            const data = await this.albumService.albumDetails(album_id);
            response.status(200).json(data)
        } else
            response.status(400).json({"error": "No album ID!"})
    }

    private checkAlbumId = async (request: Request, response: Response) => {
        let album_id = request.params.id
        if (album_id != null) {
            const data = await this.albumService.albumDetails(album_id);
            if (data != null)
                response.status(200).json({"check": true})
            else
                response.status(200).json({"check": false})
        } else
            response.status(400).json({"error": "No album ID!"})
    }

    private getAlbumName = async (request: Request, response: Response) => {
        let album_id = request.params.id
        if (album_id != null) {
            const data = await this.albumService.albumDetails(album_id);
            if (data != null)
                response.status(200).json(data.name)
            else
                response.status(200).json()
        } else
            response.status(400).json({"error": "No album ID!"})
    }

    private getAlbumImage = async (request: Request, response: Response) => {
        let album_id = request.params.id
        if (album_id != null) {
            const data = await this.albumService.albumDetails(album_id);
            if (data != null)
                response.status(200).json(data.image_url)
            else
                response.status(200).json()
        } else
            response.status(400).json({"error": "No album ID!"})
    }

    private getAlbumsFromArtist = async (request: Request, response: Response) => {
        let artist_id = request.params.id
        if (artist_id != null) {
            const data = await this.albumService.albumsFromArtist(artist_id);
            response.status(200).json(data)
        } else
            response.status(400).json({"error": "No artist ID!"})
    }


    private addAlbum = async (request: Request, response: Response) => {
        const {name, billboard, artists, popularity, total_tracks, type, image_url, artist_id, date, date_precision, song_ids} = request.body
        const album_schema = Joi.object({
            name: Joi.string().required(),
            billboard: Joi.string().required(),
            artists: Joi.string().required(),
            popularity: Joi.number().required(),
            total_tracks: Joi.number().required(),
            type: Joi.string().required(),
            image_url: Joi.string().required()
        })
        const release_schema = Joi.object({
            artist_id: Joi.string().required(),
            date: Joi.string().required(),
            date_precision: Joi.string().required()
        })

        try {
            const album = await album_schema.validateAsync({name, billboard, artists, popularity, total_tracks, type, image_url})
            const release = await release_schema.validateAsync({artist_id, date, date_precision})
            const album_result = await this.albumService.addAlbum(album)
            if (album_result !== null) {
                const album_id = album_result.album_id
                const release_result = await this.albumService.addRelease(release, album_id)

                if (release_result) {
                    if (song_ids !== null)
                        if (song_ids.length > 0)
                            song_ids.forEach(async (song_id: string, idx: number) => 
                                await this.albumService.updateTrack(idx+1, album_id, song_id));

                    response.status(200).json({"msg": "OK", "album_id": album_id});
                } else
                    response.status(400).json({"msg": "Adding release to DB failed!", "album_id": album_id});
            } else
                response.status(400).json({"msg": "Adding album to DB failed!"});

        } catch (error) {
            console.error(`Validation Error: ${error}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }

    private delAlbum = async (request: Request, response: Response) => {
        const {album_id} = request.body
        if (album_id !== null) {
            const result1 = await this.albumService.deleteAlbum(album_id)
            const result2 = await this.albumService.deleteRelease(album_id)
            if (result1 && result2) {
                const result3 = await this.albumService.clearAlbumFromTracks(album_id)
                response.status(200).json({
                    "msg": "OK",
                    "del_album": result1,
                    "del_release": result2,
                    "clear_tracks": result3
                });
            } else
                response.status(400).json({
                    "msg": "Deleting albums from DB failed!",
                    "del_album": result1,
                    "del_release": result2
                });
        } else 
            response.status(400).json({"error": "No album ID!"})
    }

} export default AlbumController