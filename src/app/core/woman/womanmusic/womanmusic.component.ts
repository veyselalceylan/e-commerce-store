import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womanmusic',
  templateUrl: './womanmusic.component.html',
  styleUrl: './womanmusic.component.css'
})
export class WomanmusicComponent {
  otherProducts: any[] = [];
  filteredProducts: any[] = [];
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/music';
  ngOnInit(): void {
   
  }
}
