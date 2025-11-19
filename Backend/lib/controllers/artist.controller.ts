import Controller from "lib/interfaces/controller.interface";
import { Request, Response, Router } from 'express';
import Joi from "joi";
import ArtistService from "../db/services/artist.service";


class ArtistController implements Controller {
    public path = '/api/artist'
    public router = Router()
    public artistService = new ArtistService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}s/search`, this.searchArtists)
        this.router.get(`${this.path}/:id`, this.getArtistDetails)
        this.router.get(`${this.path}/check/:id`, this.checkArtistID)
        this.router.get(`${this.path}/image/:id`, this.getArtistImage)

        this.router.post(`${this.path}/add`, this.addArtist)
        this.router.delete(`${this.path}/del`, this.delArtist)
    }

    private searchArtists = async (request: Request, response: Response) => {
        let phrase = request.query.q
        if (phrase != null) {
            const data = await this.artistService.searchArtist(phrase);
            response.status(200).json(data)
        } else 
            response.status(400).json({"error": "No query!"})
    }

    private getArtistDetails = async (request: Request, response: Response) => {
        let artist_id = request.params.id
        if (artist_id != null) {
            const data = await this.artistService.artistDetails(artist_id);
            response.status(200).json(data)
        } else
            response.status(400).json({"error": "No artist ID!"})
    }

    private checkArtistID = async (request: Request, response: Response) => {
        let artist_id = request.params.id
        if (artist_id != null) {
            const data = await this.artistService.artistDetails(artist_id);
            if (data != null)
                response.status(200).json({"check": true})
            else
                response.status(200).json({"check": false})
        } else
            response.status(400).json({"error": "No artist ID!"})
    }

    private getArtistImage = async (request: Request, response: Response) => {
        let artist_id = request.params.id
        if (artist_id != null) {
            const data = await this.artistService.artistDetails(artist_id);
            if (data != null)
                response.status(200).json(data.image_url)
            else
                response.status(200).json()
        } else
            response.status(400).json({"error": "No album ID!"})
    }


    private addArtist = async (request: Request, response: Response) => {
        const {name, followers, popularity, type, main_genre, genres, image_url} = request.body;
        const artist_schema = Joi.object({
            name: Joi.string().required(),
            followers: Joi.string().required(),
            popularity: Joi.number().required(),
            type: Joi.string().required(),
            main_genre: Joi.string().required(),
            genres: Joi.string().required(),
            image_url: Joi.string().required()
        })

        try {
            const artist = await artist_schema.validateAsync({name, followers, popularity, type, main_genre, genres, image_url})
            const artist_result = await this.artistService.addArtist(artist)
            if (artist_result !== null) {
                const artist_id = artist_result.artist_id
                response.status(200).json({"msg": "OK", "artist_id": artist_id});
            } else
                response.status(400).json({"msg": "Adding artist to DB failed!"});
        } catch (error) {
            console.error(`Validation Error: ${error}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }


    private delArtist = async (request: Request, response: Response) => {
        const {artist_id} = request.body
        if (artist_id !== null) {
            const result = await this.artistService.deleteArtist(artist_id)
            if (result) {
                response.status(200).json({
                    "msg": "OK",
                    "del_artist": result
                });
            } else
                response.status(400).json({
                    "msg": "Deleting artist from DB failed!",
                    "del_artist": result
                });
        } else 
            response.status(400).json({"error": "No artist ID!"})
    }

} export default ArtistController