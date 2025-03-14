import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { CoreComponent } from './core/core.component';
import { ManComponent } from './core/man/man.component';
import { KidsComponent } from './core/kids/kids.component';
import { BusinessComponent } from './core/man/business/business.component';
import { CasualComponent } from './core/man/casual/casual.component';
import { DoctorComponent } from './core/man/doctor/doctor.component';
import { HeroComponent } from './core/man/hero/hero.component';
import { MusicComponent } from './core/man/music/music.component';
import { SoldierComponent } from './core/man/soldier/soldier.component';
import { SportComponent } from './core/man/sport/sport.component';
import { WomanComponent } from './core/woman/woman.component';
import { WomanbusinessComponent } from './core/woman/womanbusiness/womanbusiness.component';
import { WomancasualComponent } from './core/woman/womancasual/womancasual.component';
import { WomandoctorComponent } from './core/woman/womandoctor/womandoctor.component';
import { WomanheroComponent } from './core/woman/womanhero/womanhero.component';
import { WomanmusicComponent } from './core/woman/womanmusic/womanmusic.component';
import { WomansoldierComponent } from './core/woman/womansoldier/womansoldier.component';
import { WomansportComponent } from './core/woman/womansport/womansport.component';
import { SchoolComponent } from './core/others/school/school.component';
import { FamilyComponent } from './core/others/family/family.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CheckOutComponent } from './core/check-out/check-out.component';
import { WomankitchenComponent } from './core/woman/womankitchen/womankitchen.component';
import { GeneralmanComponent } from './core/man/generalman/generalman.component';
import { GeneralwomanComponent } from './core/woman/generalwoman/generalwoman.component';
import { GeneralkidsComponent } from './core/kids/generalkids/generalkids.component';
import { AdminComponent } from './admin/admin.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { OthersComponent } from './core/others/others.component';
import { OthersgeneralComponent } from './core/others/othersgeneral/othersgeneral.component';
import { BoyComponent } from './core/kids/boy/boy.component';
import { GirlComponent } from './core/kids/girl/girl.component';
import { BabyComponent } from './core/kids/baby/baby.component';
import { LoversComponent } from './core/others/lovers/lovers.component';
import { WeddingComponent } from './core/others/wedding/wedding.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ProductDetailComponent } from './core/product-detail/product-detail.component';
import { SuccessComponent } from './core/check-out/success/success.component';
import { FailedComponent } from './core/check-out/failed/failed.component';


const redirectLoggedInToDashboard = () => redirectLoggedInTo(['home']);
const redirectUnauthorizedTosignIn = () => redirectUnauthorizedTo('signin');
const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  { 
    path: 'signin', 
    component: SignInComponent,
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: redirectLoggedInToDashboard } 
  },
  { 
    path: 'signup', 
    component: SignUpComponent,
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: redirectLoggedInToDashboard } 
  },
  { path: 'forgot-password', component: ForgotPasswordComponent,canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectLoggedInToDashboard} },
  { path: 'profile', component: ProfileComponent,canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedTosignIn} },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact-us', component: ContactComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AngularFireAuthGuard, adminOnly] },
  { path: 'add-product', component: AddProductComponent, canActivate: [AngularFireAuthGuard, adminOnly] },
  { path: 'home', component: CoreComponent },
  { path: 'check-out', component: CheckOutComponent },
  { path: 'check-out/order/:id', component: SuccessComponent },
  { path: 'check-out/failed', component: FailedComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { 
    path: 'kids', 
    component: KidsComponent, 
    children: [
      { path: '', component: GeneralkidsComponent },
      { path: 'boys', component: BoyComponent },
      { path: 'girls', component: GirlComponent },
      { path: 'baby', component: BabyComponent },
    ]
  },
  { 
    path: 'man', 
    component: ManComponent, 
    children: [
      { path: '', component: GeneralmanComponent },
      { path: 'business', component: BusinessComponent },
      { path: 'casual', component: CasualComponent },
      { path: 'doctor', component: DoctorComponent },
      { path: 'hero', component: HeroComponent },
      { path: 'music', component: MusicComponent },
      { path: 'soldier', component: SoldierComponent },
      { path: 'sport', component: SportComponent }
    ]
  },
  { 
    path: 'woman', 
    component: WomanComponent, 
    children: [
      { path: '', component: GeneralwomanComponent },
      { path: 'business', component: WomanbusinessComponent },
      { path: 'casual', component: WomancasualComponent },
      { path: 'doctor', component: WomandoctorComponent },
      { path: 'hero', component: WomanheroComponent },
      { path: 'music', component: WomanmusicComponent },
      { path: 'soldier', component: WomansoldierComponent },
      { path: 'sport', component: WomansportComponent },
      { path: 'kitchen', component: WomankitchenComponent }
    ]
  },
  { 
    path: 'other', 
    component: OthersComponent, 
    children: [
      { path: '', component: OthersgeneralComponent },
      { path: 'married', component: WeddingComponent },
      { path: 'lover', component: LoversComponent },
      { path: 'family', component: FamilyComponent },
      { path: 'school', component: SchoolComponent },
    ]
  },
  { path: 'checkout', component: CheckOutComponent },
  { path: '**', redirectTo: '/home' }, 
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})




export class AppRoutingModule {


  
 }
