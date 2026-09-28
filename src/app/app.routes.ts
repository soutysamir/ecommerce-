import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'', component:AuthLayoutComponent,
    children:[
    {path:'login',loadComponent:()=>import('./pages/login/login.component').then((c)=>c.LoginComponent),title:'login'},
    {path:'register',loadComponent:()=>import('./pages/register/register.component').then((c)=>c.RegisterComponent),title:'register'},
    {path:'forgetpassword',loadComponent:()=>import('./shared/components/forgetpassword/forgetpassword.component').then((c)=>c.ForgetpasswordComponent),title:'forgetpassword'},

  ]},
  {path:'', component:BlankLayoutComponent, canActivate:[authGuard],
    children:[
    {path:'home',loadComponent:()=>import('./pages/home/home.component').then((c)=>c.HomeComponent),title:'home'},
    {path:'cart',loadComponent:()=>import('./pages/cart/cart.component').then((c)=>c.CartComponent) ,title:'cart'},
    {path:'wishlist',loadComponent:()=>import('./pages/wishlist/wishlist.component').then((c)=>c.WishlistComponent) ,title:'wishlist'},
    {path:'allorders',loadComponent:()=>import('./pages/allorders/allorders.component').then((c)=>c.AllordersComponent),title:'allorders'},

    {path:'categories',loadComponent:()=>import('./pages/categories/categories.component').then((c)=>c.CategoriesComponent),title:'categories'},
    {path:'products',loadComponent:()=>import('./pages/products/products.component').then((c)=>c.ProductsComponent),title:'products'},
    {path:'brands',loadComponent:()=>import('./pages/brands/brands.component').then((c)=>c.BrandsComponent),title:'brands'},
    {path:'checkout/:id',loadComponent:()=>import('./pages/checkout/checkout.component').then((c)=>c.CheckoutComponent),title:'checkout'},
    {path:'details/:id',loadComponent:()=>import('./pages/Productdetails/details.component').then((c)=>c.DetailsComponent),title:'details'},
    {path:'branddetails/:id',loadComponent:()=>import('./pages/branddetails/branddetails.component').then((c)=>c.BranddetailsComponent),title:'branddetails'},
    {path:'categorydetails/:id',loadComponent:()=>import('./pages/categorydetails/categorydetails.component').then((c)=>c.CategorydetailsComponent),title:'categorydetails'},

    {path:'**',loadComponent:()=>import('./pages/noutfound/noutfound.component').then((c)=>c.NoutfoundComponent)},




  ]}
];
