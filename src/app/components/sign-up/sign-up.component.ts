import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../url';
@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  API_URL = API_URL;

  constructor(private router: Router,
              private http: HttpClient
              ) 
  { }

  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    phone: new FormControl(''),
    skills: new FormControl(''),
    education: new FormControl(''),
    year_of_passing: new FormControl(''),
    percentage: new FormControl('')
  });

  navigate(path: string) {
    this.router.navigate([path]);
  }

  resetForm() {
    this.form.reset();
  }
  
  onSubmit() {
    console.log(this.form.value);
    this.http.post(this.API_URL+'signup', {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
      phone: this.form.value.phone,
      skills: this.form.value.skills,
      education: this.form.value.education,
      year_of_passing: this.form.value.year_of_passing,
      percentage: this.form.value.percentage
    }).subscribe(
      (      res: any) => {
        console.log('Success:', res),
        this.navigate('/sign-in');
        // this.form.reset();
        alert(res.message);
        // this.resetForm();
      },
      (err: any) =>{
        console.error('Error:', err);
        alert('Registration failed. Please try again.');
      }
    );
    // this.form.reset();
  }
}
