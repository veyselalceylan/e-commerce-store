import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-generalkids',
  templateUrl: './generalkids.component.html',
  styleUrl: './generalkids.component.css'
})
export class GeneralkidsComponent {
  constructor(private productService: CategoryService) {
   
  } 
  url: string = 'kids';
 
}
