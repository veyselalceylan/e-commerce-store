import { Component, Input, HostListener, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'  
      })),
      state('out', style({
        transform: 'translateX(-105%)'  
      })),
      transition('in <=> out', [
        animate('300ms ease-in-out')  
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  @Input() sidebarOpened: boolean = false;
  @Input() sidebarVisible: boolean = true;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  constructor(private router: Router,private authService: AuthService){

  }
  currentUser: any;
  async ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.pageChanged(event.urlAfterRedirects);
    });
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user; 
    });
    console.log(this.currentUser)
  }
  pageChanged(url: string) {
    this.sidebarOpened = false; 
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const sidebar = document.querySelector('.sidebar');
    if (this.sidebarOpened && sidebar && !sidebar.contains(event.target as Node)) {
      this.sidebarOpened = false; 
    }
  }

  logOut(){
    this.authService.logOut();
    this.sidebarOpened = false; this.currentUser = '';
    this.router.navigate(['/home']);
  }
}
