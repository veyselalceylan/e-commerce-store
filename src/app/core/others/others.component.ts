import { Component, OnInit } from '@angular/core';
import { SortService } from '../../services/sort.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrl: './others.component.css'
})
export class OthersComponent{
  constructor(private router: Router,private sortService: SortService) {

  }
  selectedSort: string = 'none';
  onSortChange(event: any) {
    this.sortService.changeData(event.target.value);
    this.selectedSort = event.target.value;
  }
  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.getRoute(selectedValue);
  }

  getRoute(path: string): void {
    this.router.navigate([path]);
  }
}
