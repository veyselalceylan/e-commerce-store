import { Component, HostListener,OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { query, ref, onValue, orderByKey, limitToFirst, startAt } from 'firebase/database';
import { Router } from '@angular/router';
import { CategoryService } from './services/category.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e-commerce';
  sidebarOpened: boolean = false;
  shoppingChartOpened: boolean = false;
  searchQuery: string = '';
  showSearchBar: boolean = false;
  loadApp: boolean = false;
  constructor(private productService: CategoryService){
    const pathForDb = 'title';
    let listRef = ref(this.productService.db, pathForDb)
    onValue(listRef, (snapshot) => {
      this.loadApp = true;
    });
  }
  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }
  toogleShoppingChart() {
    this.shoppingChartOpened = !this.shoppingChartOpened;
  }
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    if (!this.showSearchBar) {
      this.searchQuery = '';
    }
  }
  onSearchInputChanged(query: string) {
    this.searchQuery = query;
  }
  updateShoppingChartOpened(opened: boolean) {
    this.shoppingChartOpened = opened;
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const navbarElement = document.querySelector('app-navbar');
    const shoppingPopupElement = document.querySelector('app-shopping-popup');
    const target = event.target as HTMLElement;
    if (!navbarElement?.contains(target) && !shoppingPopupElement?.contains(target)) {
      this.shoppingChartOpened = false;
    }
  }

}
