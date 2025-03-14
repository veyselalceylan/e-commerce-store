import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-boy',
  templateUrl: './boy.component.html',
  styleUrl: './boy.component.css'
})
export class BoyComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'kids/boys';
  ngOnInit(): void {
   
  }

}
