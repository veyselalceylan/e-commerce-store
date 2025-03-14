import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-womandoctor',
  templateUrl: './womandoctor.component.html',
  styleUrl: './womandoctor.component.css'
})
export class WomandoctorComponent {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'woman/doctor';
  ngOnInit(): void {
    
  }
}
