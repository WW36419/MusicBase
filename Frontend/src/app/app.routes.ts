import { Routes } from '@angular/router';
import { authGuard } from './services/userbase/auth.guard';
import { adminGuard } from './services/userbase/admin.guard';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./components/homepage/homepage.component')
            .then(m => m.HomepageComponent)
    },
    {
        path: "song/:id",
        loadComponent: () => import('./components/song-details/song-details.component')
            .then(m => m.SongDetailsComponent)
    },
    {
        path: "album/:id",
        loadComponent: () => import('./components/album-details/album-details.component')
            .then(m => m.AlbumDetailsComponent)
    },
    {
        path: "artist/:id",
        loadComponent: () => import('./components/artist-details/artist-details.component')
            .then(m => m.ArtistDetailsComponent)
    },
    {
        path: "login",
        loadComponent: () => import('./components/login/login.component')
            .then(m => m.LoginComponent)
    },
    {
        path: "signup",
        loadComponent: () => import('./components/signup/signup.component')
            .then(m => m.SignupComponent)
    },
    {
        path: "favourites",
        loadComponent: () => import('./components/favourites/favourites.component')
            .then(m => m.FavouritesComponent),
        canActivate: [authGuard]
    },
    {
        path: "admin",
        loadComponent: () => import('./components/admin-panel/admin-panel.component')
            .then(m => m.AdminPanelComponent),
        canActivate: [adminGuard]
    }
];
