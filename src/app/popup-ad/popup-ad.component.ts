import { Component } from '@angular/core';

@Component({
  selector: 'app-popup-ad',
  templateUrl: './popup-ad.component.html',
  styleUrl: './popup-ad.component.css'
})
export class PopupAdComponent {
  isPopupVisible: boolean = true;
  dontShowAgain: boolean = false;
  constructor() {}

  handleButtonClick() {
    if (this.dontShowAgain) {
      this.saveAndClose();
    } else {
      this.closePopup();
    }
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  saveAndClose() {
    localStorage.setItem('dontShowAgain', 'true'); 
    this.isPopupVisible = false; 
  }

  ngOnInit() {
    if (localStorage.getItem('dontShowAgain') === 'true') {
      this.isPopupVisible = false;
    }
  }
}
