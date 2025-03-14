import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrl: './kids.component.css'
})
export class KidsComponent implements OnInit {
  constructor(private router: Router,private sortService: SortService) {

  }
  pageName: string = '';

  ngOnInit(): void {
    if (this.router.url === '/kid') {
      this.pageName = 'All Kid '  
    } else if (this.router.url === '/kid/boy') {
      this.pageName = 'Boy '
    } else if (this.router.url === '/kid/girl') {
      this.pageName = 'Girl '
    } else if (this.router.url === '/kid/baby') {
      this.pageName = 'Baby '
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.pageChanged(event.urlAfterRedirects);
    });
  }
  pageChanged(url: string) {
    if (this.router.url === '/kid') {
      this.pageName = 'All Kid '  
    } else if (this.router.url === '/kid/boy') {
      this.pageName = 'Boy '
    } else if (this.router.url === '/kid/girl') {
      this.pageName = 'Girl '
    } else if (this.router.url === '/kid/baby') {
      this.pageName = 'Baby '
    }
  
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
