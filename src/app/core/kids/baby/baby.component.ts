import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-baby',
  templateUrl: './baby.component.html',
  styleUrl: './baby.component.css'
})
export class BabyComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'kids/baby';
  ngOnInit(): void {
   
  }
}
