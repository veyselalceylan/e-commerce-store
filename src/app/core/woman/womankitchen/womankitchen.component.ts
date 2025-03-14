import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womankitchen',
  templateUrl: './womankitchen.component.html',
  styleUrl: './womankitchen.component.css'
})
export class WomankitchenComponent {
  otherProducts: any[] = [];
  filteredProducts: any[] = [];
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/kitchen';
  ngOnInit(): void {
    
  }
}
