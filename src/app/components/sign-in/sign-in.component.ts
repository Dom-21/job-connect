import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { API_URL } from '../url';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  API_URL = API_URL
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  

  constructor(private router: Router,
              private http: HttpClient
  ) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  resetForm() {
    this.form.reset();
  }

  onSubmit() {
    console.log(this.form.value);
    this.http.post(this.API_URL+'signin', {
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe(
      (res: any) => {
        console.log('Success:', res),
        this.navigate('/dashboard');
        alert(res.message);
      },
      (err: any) => {
        console.error('Error:', err);
        alert('Login failed. Please try again.');
      }
    );
  }
}
