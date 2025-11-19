import App from './app';
import AlbumController from './controllers/album.controller';
import ArtistController from './controllers/artist.controller';
import SongController from './controllers/song.controller';
import UserController from './controllers/user.controller';

const app: App = new App([
    new UserController(),
    new SongController(),
    new ArtistController(),
    new AlbumController()
]);

app.listen();