import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrl: './wedding.component.css'
})
export class WeddingComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'other/married';
  ngOnInit(): void {
    
  }
}
