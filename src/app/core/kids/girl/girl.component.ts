import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-girl',
  templateUrl: './girl.component.html',
  styleUrl: './girl.component.css'
})
export class GirlComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'kids/girls';
  ngOnInit(): void {
   
  }
}
