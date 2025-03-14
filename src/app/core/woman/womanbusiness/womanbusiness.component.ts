import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womanbusiness',
  templateUrl: './womanbusiness.component.html',
  styleUrl: './womanbusiness.component.css'
})
export class WomanbusinessComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/business';
  ngOnInit(): void {
    
  }
}
