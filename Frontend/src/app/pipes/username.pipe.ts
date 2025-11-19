import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/userbase/user.service';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {
  constructor(private service: UserService) {}

  transform(userId: string): Observable<string> {
    return this.service.getUsername(userId).pipe(
      map((result: any) => result.name || '???')
    );
  }
}
