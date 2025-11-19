import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Top10SongsAllComponent } from '../top10-songs-all/top10-songs-all.component';

@Component({
  selector: 'homepage',
  standalone: true,
  imports: [RouterModule, Top10SongsAllComponent, SearchBarComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {}
