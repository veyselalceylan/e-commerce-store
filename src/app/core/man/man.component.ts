import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
@Component({
  selector: 'app-man',
  templateUrl: './man.component.html',
  styleUrl: './man.component.css'
})
export class ManComponent {
  pageName: string = '';
  constructor(private router: Router,private sortService: SortService) {

  }
  ngOnInit(): void {
    if (this.router.url === '/man') {
      this.pageName = 'All Man '
    } else if (this.router.url === '/man/casual') {
      this.pageName = 'Casual '
    } else if (this.router.url === '/man/business') {
      this.pageName = 'Business '
    } else if (this.router.url === '/man/doctor') {
      this.pageName = 'Doctor '
    }else if (this.router.url === '/man/hero') {
      this.pageName = 'Hero '
    }else if (this.router.url === '/man/music') {
      this.pageName = 'Music '
    }else if (this.router.url === '/man/soldier') {
      this.pageName = 'Soldier '
    }else if (this.router.url === '/man/sport') {
      this.pageName = 'Sport '
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.pageChanged(event.urlAfterRedirects);
    });
  }
  pageChanged(url: string) {
    if (this.router.url === '/man') {
      this.pageName = 'All Man '
    } else if (this.router.url === '/man/casual') {
      this.pageName = 'Casual '
    } else if (this.router.url === '/man/business') {
      this.pageName = 'Business '
    } else if (this.router.url === '/man/doctor') {
      this.pageName = 'Doctor '
    }else if (this.router.url === '/man/hero') {
      this.pageName = 'Hero '
    }else if (this.router.url === '/man/music') {
      this.pageName = 'Music '
    }else if (this.router.url === '/man/soldier') {
      this.pageName = 'Soldier '
    }else if (this.router.url === '/man/sport') {
      this.pageName = 'Sport '
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
