import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womansoldier',
  templateUrl: './womansoldier.component.html',
  styleUrl: './womansoldier.component.css'
})
export class WomansoldierComponent {
  otherProducts: any[] = [];
  filteredProducts: any[] = [];
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/soldier';
  ngOnInit(): void {
    
  }
}
