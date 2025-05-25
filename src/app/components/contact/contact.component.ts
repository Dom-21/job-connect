import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { API_URL } from '../url';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  API_URL = API_URL;
  @ViewChild('contactForm') contactForm!: ElementRef;

  constructor(private http: HttpClient) { }

  sendMessage(message: string) {
    this.http.post('http://localhost:3000/api/messages', { message }).subscribe(response => {
      console.log(response);
    });
  }

  showFeedback(message: string, type: string) {
    const feedbackDiv = document.getElementById('feedback');
    if (feedbackDiv) {
      feedbackDiv.style.display = 'block';
      feedbackDiv.textContent = message;
      feedbackDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
      feedbackDiv.style.color = type === 'success' ? '#155724' : '#721c24';
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      this.showFeedback('Please fill out all fields.', 'error');
      return;
    }
    console.log(name, email, message);

    this.http.post(API_URL+'submit', { name, email, message }).subscribe({
      next: () => {
        this.showFeedback('Thank you! Your message has been sent.', 'success');
        form.reset();
      },
      error: () => {
        this.showFeedback('There was an error sending your message. Please try again.', 'error');
      }
    });
  }
}
