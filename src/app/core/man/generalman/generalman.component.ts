import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-generalman',
  templateUrl: './generalman.component.html',
  styleUrl: './generalman.component.css'
})
export class GeneralmanComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'man';
  ngOnInit(): void {
    
  }
}
