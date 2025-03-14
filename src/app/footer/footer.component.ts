import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isAdminUser: any;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUser();
      this.isAdminUser = user;
      console.log(this.isAdminUser);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
}
