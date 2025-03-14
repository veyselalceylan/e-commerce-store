import { Component, ViewChild, ElementRef } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  providers: [MessageService]
})
export class SignInComponent {
  showPassword: boolean = false;
  errorMessage: string | null = null;
  email: string = '';
  password: string = '';
  constructor(private authService: AuthService, private messageService: MessageService,
    private router: Router
  ) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async signIn() {

    if (this.email.trim() === '' || !this.email.includes('@')) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    if (this.password.trim() === '') {
      this.errorMessage = 'Password cannot be empty';
      return;
    }
    const error = await this.authService.signIn(this.email, this.password);
    console.log(error)
    if (error) {
      this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'Invalid Mail or Password, Please Try Again', life: 3000 });
    } else {
      this.router.navigate(['home']);
    }
  }
}
