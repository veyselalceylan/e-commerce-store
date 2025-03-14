import { Component } from '@angular/core';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrl: './warning-popup.component.css'
})
export class WarningPopupComponent {
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
    localStorage.setItem('dontWarningShowAgain', 'true'); 
    this.isPopupVisible = false; 
  }

  ngOnInit() {
    if (localStorage.getItem('dontWarningShowAgain') === 'true') {
      this.isPopupVisible = false;
    }
  }
}
