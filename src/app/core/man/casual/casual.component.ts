import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-casual',
  templateUrl: './casual.component.html',
  styleUrl: './casual.component.css'
})
export class CasualComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'man/casual';
  ngOnInit(): void {
   
  }
}
