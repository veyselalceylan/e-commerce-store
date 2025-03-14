import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womansport',
  templateUrl: './womansport.component.html',
  styleUrl: './womansport.component.css'
})
export class WomansportComponent {
  otherProducts: any[] = [];
  filteredProducts: any[] = [];
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/sport';
  ngOnInit(): void {
   
  }
}
