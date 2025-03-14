import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrl: './school.component.css'
})
export class SchoolComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'other/school';
  ngOnInit(): void {
    
  }
}
