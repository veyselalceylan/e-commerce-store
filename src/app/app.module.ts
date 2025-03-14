import { NgModule, CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../enviroments/enviroments';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CoreComponent } from './core/core.component';
import { FooterComponent } from './footer/footer.component';
import { KidsComponent } from './core/kids/kids.component';
import { ManComponent } from './core/man/man.component';
import { WomanComponent } from './core/woman/woman.component';
import { FamilyComponent } from './core/others/family/family.component';
import { SchoolComponent } from './core/others/school/school.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';
import { SearchResultComponent } from './core/search-result/search-result.component';
import { CheckOutComponent } from './core/check-out/check-out.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { GeneralkidsComponent } from './core/kids/generalkids/generalkids.component';
import { GeneralmanComponent } from './core/man/generalman/generalman.component';
import { GeneralwomanComponent } from './core/woman/generalwoman/generalwoman.component';
import { AdminComponent } from './admin/admin.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { DividerModule } from 'primeng/divider';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OthersComponent } from './core/others/others.component';
import { OthersgeneralComponent } from './core/others/othersgeneral/othersgeneral.component';
import { BoyComponent } from './core/kids/boy/boy.component';
import { GirlComponent } from './core/kids/girl/girl.component';
import { BabyComponent } from './core/kids/baby/baby.component';
import { CasualComponent } from './core/man/casual/casual.component';
import { LoversComponent } from './core/others/lovers/lovers.component';
import { BusinessComponent } from './core/man/business/business.component';
import { DoctorComponent } from './core/man/doctor/doctor.component';
import { HeroComponent } from './core/man/hero/hero.component';
import { MusicComponent } from './core/man/music/music.component';
import { SoldierComponent } from './core/man/soldier/soldier.component';
import { SportComponent } from './core/man/sport/sport.component';
import { WeddingComponent } from './core/others/wedding/wedding.component';
import { WomanbusinessComponent } from './core/woman/womanbusiness/womanbusiness.component';
import { WomancasualComponent } from './core/woman/womancasual/womancasual.component';
import { WomandoctorComponent } from './core/woman/womandoctor/womandoctor.component';
import { WomansoldierComponent } from './core/woman/womansoldier/womansoldier.component';
import { WomansportComponent } from './core/woman/womansport/womansport.component';
import { WomankitchenComponent } from './core/woman/womankitchen/womankitchen.component';
import { WomanheroComponent } from './core/woman/womanhero/womanhero.component';
import { WomanmusicComponent } from './core/woman/womanmusic/womanmusic.component';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

//primeng
import { GalleriaModule } from 'primeng/galleria';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DataViewModule } from 'primeng/dataview';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SidebarModule } from 'primeng/sidebar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { MenubarModule } from 'primeng/menubar';
import { MegaMenuModule } from 'primeng/megamenu';
import { TabViewModule } from 'primeng/tabview';
import { AvatarModule } from 'primeng/avatar';
import { CardsComponent } from './core/cards/cards.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MainCardComponent } from './core/main-card/main-card.component';
import { ProfileComponent } from './user/profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ShoppingPopupComponent } from './core/shopping-popup/shopping-popup.component';
import { ProductDetailComponent } from './core/product-detail/product-detail.component';
import { CountUpModule } from 'ngx-countup';
import { RecommendProductComponent } from './core/recommend-product/recommend-product.component';
import { CommentsComponent } from './core/comments/comments.component';
import { RatingModule } from 'primeng/rating';
import { SuccessComponent } from './core/check-out/success/success.component';
import { FailedComponent } from './core/check-out/failed/failed.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { PopupAdComponent } from './popup-ad/popup-ad.component';
import { WarningPopupComponent } from './core/check-out/warning-popup/warning-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CoreComponent,
    FooterComponent,
    KidsComponent,
    ManComponent,
    WomanComponent,
    LoversComponent,
    FamilyComponent,
    SchoolComponent,
    SignInComponent,
    SignUpComponent,
    AboutComponent,
    PrivacyComponent,
    ContactComponent,
    SearchResultComponent,
    CheckOutComponent,
    ForgotPasswordComponent,
    GeneralkidsComponent,
    GeneralmanComponent,
    GeneralwomanComponent,
    AdminComponent,
    AddProductComponent,
    SidebarComponent,
    OthersComponent,
    OthersgeneralComponent,
    BabyComponent,
    BoyComponent,
    GirlComponent,
    CasualComponent,
    BusinessComponent,
    DoctorComponent,
    HeroComponent,
    MusicComponent,
    SoldierComponent,
    SportComponent,
    WeddingComponent,
    WomanbusinessComponent,
    WomancasualComponent,
    WomandoctorComponent,
    WomansoldierComponent,
    WomansportComponent,
    WomankitchenComponent,
    WomanheroComponent,
    WomanmusicComponent,
    CardsComponent,
    MainCardComponent,
    ProfileComponent,
    ShoppingPopupComponent,
    ProductDetailComponent,
    RecommendProductComponent,
    CommentsComponent,
    SuccessComponent,
    FailedComponent,
    PopupAdComponent,
    WarningPopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    CountUpModule,
    //primeng
    InputMaskModule,
    SidebarModule,
    AccordionModule,
    GalleriaModule,
    ButtonModule,
    RatingModule,
    FileUploadModule,
    CarouselModule,
    InputNumberModule,
    DropdownModule,
    DividerModule,
    PasswordModule,
    InputTextModule,
    TabViewModule,
    ProgressBarModule,
    TreeTableModule,
    TreeModule,
    StepperModule,
    ToastModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    BadgeModule,
    CardModule,
    MessageModule,
    MessagesModule,
    TableModule,
    DialogModule,
    RadioButtonModule,
    SelectButtonModule,
    InputTextareaModule,
    TagModule,
    MenubarModule,
    MegaMenuModule,
    AvatarModule,
    ProgressSpinnerModule,
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  providers: [provideHttpClient(), provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
