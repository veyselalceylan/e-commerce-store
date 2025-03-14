import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})
export class FamilyComponent {
  otherProducts: any[] = [];
  filteredProducts: any[] = [];
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'other/family';
  ngOnInit(): void {
    
  }
}
