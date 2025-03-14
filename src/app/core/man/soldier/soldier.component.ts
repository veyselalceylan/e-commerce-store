import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-soldier',
  templateUrl: './soldier.component.html',
  styleUrl: './soldier.component.css'
})
export class SoldierComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'man/soldier';
  ngOnInit(): void {
    
  }
}
