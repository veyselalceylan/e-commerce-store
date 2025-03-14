import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womanhero',
  templateUrl: './womanhero.component.html',
  styleUrl: './womanhero.component.css'
})
export class WomanheroComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/hero';
  ngOnInit(): void {
   
  }
}
