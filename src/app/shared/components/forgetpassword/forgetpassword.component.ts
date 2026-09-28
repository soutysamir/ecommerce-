import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss'
})
export class ForgetpasswordComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)


  isLoading:boolean=false;
  step:Number=1;

  verifyEmail:FormGroup= new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
  })

  verifyCode:FormGroup= new FormGroup({
    resetCode:new FormControl(null,[Validators.required,Validators.pattern(/^[0-9 ]{6}$/)]),

  })

  resetPassword:FormGroup= new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
    password:new FormControl(null,[Validators.required,Validators.pattern(/^[A-Z]\w{7,}$/)])

  })
verifyEmailSubmit():void{
this.authService.setVerfiyEmail(this.verifyEmail.value).subscribe({
  next:(res)=>{
    console.log(res)
    if(res.statusMsg==='success'){
      this.step=2
    }
  }
})
}

verifyCodeSubmit():void{
  this.authService.setVerfiyCode(this.verifyCode.value).subscribe({
    next:(res)=>{
      console.log(res)
      if(res.statusMsg==='success'){
        this.step=3
      }
    }
  })
  }

  resetPasswordSubmit():void{
    this.authService.setResetPassword(this.resetPassword.value).subscribe({
      next:(res)=>{
        console.log(res)
        if(res.statusMsg==='success'){
          localStorage.setItem('userToken',res.token)
          this.authService.saveUserData()
          this.router.navigate(['/home'])

        }
      }
    })
    }
}
