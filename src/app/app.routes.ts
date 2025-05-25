import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { JobPortalComponent } from './components/job-portal/job-portal.component';
import { JobDescriptionComponent } from './components/job-description/job-description.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

export const routes: Routes = [
    {
        path: '',
        component: SignInComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'job-portal',
        component: JobPortalComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'job-description',
        component: JobDescriptionComponent
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'sign-in',
        component: SignInComponent
    }
    
];
