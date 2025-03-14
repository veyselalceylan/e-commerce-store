import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-sport',
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.css'
})
export class SportComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'man/sport';
  ngOnInit(): void {
    
  }
}
