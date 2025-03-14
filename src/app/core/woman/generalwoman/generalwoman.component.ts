import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { SortService } from '../../../services/sort.service';

@Component({
  selector: 'app-generalwoman',
  templateUrl: './generalwoman.component.html',
  styleUrl: './generalwoman.component.css'
})
export class GeneralwomanComponent {
  constructor(private productService: CategoryService,private sortService: SortService) {
   
  }
  url: string = 'woman';
  ngOnInit(): void {
    
  }
}
