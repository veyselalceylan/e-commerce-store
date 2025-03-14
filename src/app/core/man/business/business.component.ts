import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})
export class BusinessComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'man/business';
  ngOnInit(): void {
   
  }
}
