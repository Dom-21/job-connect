import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { API_URL } from '../url';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-description',
  imports: [ReactiveFormsModule],
  templateUrl: './job-description.component.html',
  styleUrl: './job-description.component.css'
})
export class JobDescriptionComponent {
  API_URL = API_URL

  jobForm = new FormGroup({
    title: new FormControl(''),
    company: new FormControl(''),
    description: new FormControl(''),
    designation: new FormControl(''),
    requirements: new FormControl(''),
    salary: new FormControl(''),
    location: new FormControl(''),
    skills: new FormControl(''),
    year: new FormControl(''),
    qualifications: new FormControl(''),
    percentage: new FormControl(''),
    interviewMode: new FormControl(''),
    interviewRounds: new FormControl(''),
    careerPage: new FormControl('')
    
  });

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit() {
    // Initialize the form with default values or any other setup needed
  }

  resetForm() {
    this.jobForm.reset();
  }

  submitForm() {
    console.log(this.jobForm.value);
   
    this.http.post(API_URL+'submit_job', {
      title: this.jobForm.value.title,
      company: this.jobForm.value.company,
      description: this.jobForm.value.description,
      designation: this.jobForm.value.designation,
      requirements: this.jobForm.value.requirements,
      location: this.jobForm.value.location,
      salary: this.jobForm.value.salary,
      skills: this.jobForm.value.skills,
      qualification: this.jobForm.value.qualifications,
      year: this.jobForm.value.year,
      percentage: this.jobForm.value.percentage,
      interviewMode: this.jobForm.value.interviewMode,
      interviewRounds: this.jobForm.value.interviewRounds,
      careerPage: this.jobForm.value.careerPage
    }).subscribe(
     ( res:any) => {
        console.log('Success:', res),
        alert(res?.message);
        this.resetForm();
        this.router.navigate(['/job-portal']);
     },
      err => console.error('Error:', err)
    );
    
  }
}
     
