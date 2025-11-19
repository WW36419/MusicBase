import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'card-item',
  imports: [RouterModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.css'
})
export class CardItemComponent {
  @Input() id?: string
  @Input() music_type?: string
  @Input() name?: string
  @Input() content?: string
}
