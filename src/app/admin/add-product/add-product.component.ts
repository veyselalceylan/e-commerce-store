import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { mainCategory, kidsCategory, menCategory, womenCategory, otherCategory } from '../../admin/category-data';
import { CategoryService } from '../../services/category.service';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
  providers: [ConfirmationService, MessageService]
})
export class AddProductComponent {
  images: string[] = [];
  form: FormGroup;
  isFormValid = false;
  isSaved = false;
  datamainCategory = mainCategory;
  kidsCategory = kidsCategory;
  menCategory = menCategory;
  womenCategory = womenCategory;
  otherCategory = otherCategory;
  subOptions: any[] = [];
  mainCategory: any;
  selectedSubOption: any;
  constructor(private fb: FormBuilder, private router: Router, private productService: CategoryService,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.form = this.fb.group({
      mainCategory: ['', Validators.required],
      secondCategory: ['', Validators.required],
      productName: ['', Validators.required],
      productCode: ['', [Validators.required]],
      productMainDescription: ['', [Validators.required]],
      productSecondDescription: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
    this.form.get('mainCategory')!.valueChanges.subscribe(value => {
      this.mainCategory = value;
      this.updateSubOptions();
    });
  }
  checkFormValidity() {
    this.isFormValid = this.form.valid;
  }

  updateSubOptions() {
    switch (this.mainCategory) {
      case 'kids':
        this.subOptions = kidsCategory;
        break;
      case 'men':
        this.subOptions = menCategory;
        break;
      case 'women':
        this.subOptions = womenCategory;
        break;
      case 'other':
        this.subOptions = otherCategory;
        break;
      default:
        this.subOptions = [];
    }
  }

  async onFileChange(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = (e: any) => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      });

      this.images.push(fileData);
    }
    console.log(this.images);
  }

  removeImage(image: string) {
    this.images = this.images.filter(img => img !== image);
  }

  save(event: Event) {
    console.log(event)
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you save to Container?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "w-10 h-10 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 justify-center  " +
        "focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 " +
        "py-2.5 me-2 mb-2 dark:focus:ring-yellow-900",
      acceptButtonStyleClass: "w-10 h-10 focus:outline-none text-white justify-center " +
        "bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 " +
        "font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 " +
        "dark:hover:bg-green-700 dark:focus:ring-green-800",
      accept: () => {
        this.isSaved = true;
        this.productService.addProduct(this.form, this.images).then((result) => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
          this.form.reset();
          this.images = [];
          this.isSaved = false;
          window.location.reload();
        }).catch((err) => {
          this.isSaved = false;
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'There is a problem on Database', life: 3000 });
        })



      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }


}
