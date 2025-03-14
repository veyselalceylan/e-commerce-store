import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'] 
})
export class SignUpComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;
  showPasswordMismatch: boolean = false;
  isFormReady: boolean = false;
  additionalData: any;
  showEmailError: boolean | undefined;
  errorMessage: string | null = null;
  errorMailMessage: string | null = null;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false; 
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, this.emailFormatValidator()]],
      password: ['', [Validators.required, this.passwordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.checkFormValidity();
    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMismatch(); 
    });
    this.signupForm.get('email')?.valueChanges.subscribe(() => {
      this.checkEmailFormat();
    });
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
  
  ngAfterViewInit() {
    this.isFormReady = true;
    this.checkFormValidity();
  }

  checkEmailFormat() {
    const emailControl = this.signupForm.get('email');
    this.showEmailError = emailControl?.invalid && emailControl?.touched; // E-posta formatı hatası kontrolü
    this.errorMailMessage = this.showEmailError ? "Invalid email format!" : null; // Uyarı mesajını ayarla
  }

  emailFormatValidator(): any {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(control.value)) {
        return { 'invalidEmailFormat': true };
      }
      return null;
    };
  }

  // Password format validator
  passwordValidator(): any {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;
      return !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}/.test(value) ? { passwordRequirements: true } : null;
    };
  }
 
  // Password match validator
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  }

  togglePasswordVisibility() {
    console.log('asd')
    this.passwordVisible = !this.passwordVisible;
  }
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
  loading: boolean = false;
  onSubmit() {
    this.loading = true;
    if (this.signupForm.valid && !this.showPasswordMismatch) {
      const { email, password } = this.signupForm.value;
      this.authService.signUp(email, password);
      this.loading = false;
      this.errorMessage = ''; 
    } else {
      this.loading = false;
      this.errorMessage = "Passwords Doesn't Match!";
      this.signupForm.markAllAsTouched();
      this.checkFormValidity();
      this.checkPasswordMismatch();
    }
  }

  checkFormValidity() {
    const isValid = this.signupForm.valid && !this.showPasswordMismatch;
    const submitButton = document.getElementById('submit-btn') as HTMLButtonElement | null;
    if (submitButton) {
      submitButton.disabled = !isValid;
    }
  }
  checkPasswordMismatch() {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    this.showPasswordMismatch = password !== confirmPassword;
    this.errorMessage = this.showPasswordMismatch ? "Passwords Doesn't Match!" : null; 
  }

  closePasswordMismatchAlert() {
    this.showPasswordMismatch = false;
  }

  private subscribeToFormControlStatusChanges(controlName: string) {
    const control = this.signupForm.get(controlName);
    if (control) {
      control.statusChanges.subscribe(status => {
        console.log(`Form control '${controlName}' status:`, status);
      });
    }
  }
}
