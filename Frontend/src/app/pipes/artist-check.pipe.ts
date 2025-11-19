import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArtistService } from '../services/music/artist.service';

@Pipe({
  name: 'artistCheck'
})
export class ArtistCheckPipe implements PipeTransform {

  constructor(private artist_srv: ArtistService) {}

  transform(artist_id: string): Observable<string> {
    return this.artist_srv.checkArtist(artist_id).pipe(
      map((result: any) => {
        if (result != null)
          return result.check
        return false
      }
    ));
  }

}
