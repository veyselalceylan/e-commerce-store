import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-othersgeneral',
  templateUrl: './othersgeneral.component.html',
  styleUrl: './othersgeneral.component.css'
})
export class OthersgeneralComponent implements OnInit {
  constructor(private productService: CategoryService) {
   
  }
  url: string = 'other';
  ngOnInit(): void {
    
  }

}
