import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService,private confirmationService: ConfirmationService, private messageService: MessageService,
    private router: Router
  ){

  }
  isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
 
  async onPasswordReset() {
    if (!this.isValidEmail(this.email)) {
      console.log('asd')
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Please Check The Email Form', life: 3000 });
    } 
    try {
      const result = await this.authService.sendPasswordEmail(this.email);
      this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'Reset Password Mail Has Benn Sent', life: 3000 });
      setTimeout(() => {
        this.router.navigate(['/signin'])
      }, 2000);
    } catch (error: any) {
      // Hata mesajı gösterilebilir
      console.error('Hata:', error); // Konsola hata mesajı
    }
  }
  
}
