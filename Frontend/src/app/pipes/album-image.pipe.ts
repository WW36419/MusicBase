import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumService } from '../services/music/album.service';

@Pipe({
  name: 'albumImage'
})
export class AlbumImagePipe implements PipeTransform {
  defaultImg: string = 'https://static.vecteezy.com/system/resources/previews/013/995/977/original/question-mark-red-hand-drawn-doodle-faq-symbol-vector.jpg'

  constructor(private service: AlbumService) {}

  transform(albumId: string): Observable<string> {
    return this.service.getImageURL(albumId).pipe(
      map((result: any) => {
        if (result != null)
          return result
        else 
          return this.defaultImg
      }
    ));
  }

}
