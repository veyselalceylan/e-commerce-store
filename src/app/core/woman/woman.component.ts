import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
@Component({
  selector: 'app-woman',
  templateUrl: './woman.component.html',
  styleUrl: './woman.component.css'
})
export class WomanComponent {
  pageName: string = '';
  constructor(private router: Router,private sortService: SortService) {

  }
  ngOnInit(): void {
    if (this.router.url === '/woman') {
      this.pageName = 'All Woman '
    } else if (this.router.url === '/woman/casual') {
      this.pageName = 'Casual '
    } else if (this.router.url === '/woman/business') {
      this.pageName = 'Business '
    } else if (this.router.url === '/woman/doctor') {
      this.pageName = 'Doctor '
    }else if (this.router.url === '/woman/hero') {
      this.pageName = 'Hero '
    }else if (this.router.url === '/woman/music') {
      this.pageName = 'Music '
    }else if (this.router.url === '/woman/soldier') {
      this.pageName = 'Soldier '
    }else if (this.router.url === '/woman/sport') {
      this.pageName = 'Sport '
    }else if (this.router.url === '/woman/kitchen') {
      this.pageName = 'Kitchen '
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.pageChanged(event.urlAfterRedirects);
    });
  }
  pageChanged(url: string) {
    if (this.router.url === '/woman') {
      this.pageName = 'All Woman '
    } else if (this.router.url === '/woman/casual') {
      this.pageName = 'Casual '
    } else if (this.router.url === '/woman/business') {
      this.pageName = 'Business '
    } else if (this.router.url === '/woman/doctor') {
      this.pageName = 'Doctor '
    }else if (this.router.url === '/woman/hero') {
      this.pageName = 'Hero '
    }else if (this.router.url === '/woman/music') {
      this.pageName = 'Music '
    }else if (this.router.url === '/woman/soldier') {
      this.pageName = 'Soldier '
    }else if (this.router.url === '/woman/sport') {
      this.pageName = 'Sport '
    }else if (this.router.url === '/woman/kitchen') {
      this.pageName = 'Kitchen '
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
