import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  formSubmitted: boolean = false;
  modalMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{3}-\d{3}-\d{3}$/)]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.formSubmitted = true;
    const mailDetail = {
      name: this.contactForm.get('name')?.value,
      email: this.contactForm.get('email')?.value,
      phone: this.contactForm.get('phone')?.value,
      subject: this.contactForm.get('subject')?.value,
      message: this.contactForm.get('message')?.value
    }
   
    if (this.contactForm.invalid) {
      return;
    }
    try {
      this.modalMessage = 'Form sent successfully!';
      this.openModal();
      this.contactForm.reset();
      this.formSubmitted = false;
      const res = await firstValueFrom(this.http.post('https://app-r6z5go6nha-uc.a.run.app/contact-us-email', mailDetail));
      this.userService.addProduct(this.contactForm).then((result) => {
     
      
      }).catch((err) => {
        this.modalMessage = 'Form Submission Failed!';
        this.openModal();
      })
    } catch (error) {
      console.error('E-posta gönderme sırasında hata:', error);
    }
   
  }

  openModal() {
    const modalElement = document.getElementById('alertModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  get f() {
    return this.contactForm.controls;
  }

  applyMask(event: any) {
    let input = event.target.value.replace(/\D/g, '').slice(0, 9);
    if (input.length >= 6) {
      input = input.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
    } else if (input.length >= 3) {
      input = input.replace(/(\d{3})(\d+)/, '$1-$2');
    }
    event.target.value = input;
  }

}
