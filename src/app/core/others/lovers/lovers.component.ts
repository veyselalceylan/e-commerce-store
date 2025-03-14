import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-lovers',
  templateUrl: './lovers.component.html',
  styleUrl: './lovers.component.css'
})
export class LoversComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'other/lover';
  ngOnInit(): void {
   
  }
}
