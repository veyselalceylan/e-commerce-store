import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womancasual',
  templateUrl: './womancasual.component.html',
  styleUrl: './womancasual.component.css'
})
export class WomancasualComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/casual';
  ngOnInit(): void {
    
  }
}
