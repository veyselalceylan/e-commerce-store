import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrl: './music.component.css'
})
export class MusicComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'man/music';
  ngOnInit(): void {
    
  }
}
