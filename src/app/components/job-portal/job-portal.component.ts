import { Component, ChangeDetectorRef } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API_URL } from '../url';

@Component({
  selector: 'app-job-portal',
  imports: [CommonModule, PaginatorModule, DialogModule],
  templateUrl: './job-portal.component.html',
  styleUrl: './job-portal.component.css'
})
export class JobPortalComponent {
  API_URL = API_URL;

  currentPage = 1;
  jobsPerPage = 12;
  jobs:any = {
    jobs:jobs,
    count:jobs.length
  }
  first: number = 0;
  rows: number = 10;
  visible: boolean = false;
  currentJob: any;
  filtered_jobs: any[] = [];
  searchText: string = '';
 

  constructor(private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {

  }

  ngOnInit(): void {
    this.jobs = jobs;
    this.currentJob = this.jobs[0];
    this.getJobs();
  }

  search(){
    console.log("Search:", this.searchText);
    const search:any = document.getElementById('search');
    this.searchText = search?.value || '';
    console.log("Search Text:", this.searchText);
    if (this.searchText) {
      console.log("Filtering jobs based on search text:", this.searchText);
      this.filtered_jobs = this.jobs['jobs'].filter((job: any) =>
        job.requirements?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.designation?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.company?.toLowerCase().includes(this.searchText.toLowerCase()) ||    
        job.title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.location?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.salary?.toString().includes(this.searchText.toLowerCase())
      );
      console.log("Filtered Jobs:", this.filtered_jobs);
    } else {
      this.filtered_jobs = this.jobs['jobs'];
    }
  }


  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  getJobs(): void {
      this.http.get(this.API_URL+'jobs')
        .subscribe((response: any) => {
          console.log(response);
          this.jobs['jobs'] = response.data.jobs; 
          this.jobs['count']=response.data.count;
          this.filtered_jobs = this.jobs['jobs']
                 

        }
      );
  } 

  // Dark mode toggle functionality
  toggleDarkMode() {
    const body = document.body;
    const header = document.querySelector('header');
    const searchInputs = document.querySelectorAll('input[type="text"], #sort-options');
    const buttons = document.querySelectorAll('button');

    body.classList.toggle('dark-mode');
    if (header) {
      header.classList.toggle('dark-mode');
    }
    searchInputs.forEach(input => {
      input.classList.toggle('dark-mode');
    });
    buttons.forEach(button => {
      button.classList.toggle('dark-mode');
    });

    // Save dark mode preference to local storage
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.setItem('darkMode', 'disabled');
    }
  }




  // Function to render content without authentication check
  renderContent() {
    const jobContainer = document.getElementById('job-container');
    if (jobContainer) {
      jobContainer.style.display = 'block'; // Show jobs section
    }
    this.renderPaginatedJobs(this.currentPage); // Render jobs from the global variable
  }

  // Function to render jobs with pagination
  renderPaginatedJobs(page: number) {
    const startIndex = (page - 1) * this.jobsPerPage;
    const endIndex = startIndex + this.jobsPerPage;
    const paginatedJobs = this.jobs.slice(startIndex, endIndex);
    this.renderJobs(paginatedJobs);
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
      pageInfo.textContent = `Page ${page} of ${Math.ceil(this.jobs.length / this.jobsPerPage)}`;
    }
  }

  renderJobs(paginatedJobs: any[]) {
    const jobListContainer = document.getElementById('job-list');
    if (jobListContainer) {
      jobListContainer.innerHTML = '';

      if (paginatedJobs.length === 0) {
        jobListContainer.innerHTML = '<p>No jobs found.</p>';
      } else {
        paginatedJobs.forEach(job => {
          const jobElement = document.createElement('div');
          jobElement.classList.add('job-item');

          jobElement.innerHTML = `
            <h3 class="job-title">${job.designation}</h3>
            <p class="company">${job.company}</p>
            <p class="requirements">Requirements: ${job.requirements}</p>
            <p class="salary">Salary: ${job.salary}</p>
          `;

          jobElement.addEventListener('click', () => {
            this.openModal(job);
          });

          jobListContainer.appendChild(jobElement);
        });
      }
    }
  }
  // Function to render job listings
  renderJobList(jobList: any[]) {
    // This method is already implemented above - removing duplicate implementation
    const jobListContainer = document.getElementById('job-list');
    if (!jobListContainer) return;

    jobListContainer.innerHTML = '';
    if (jobList.length === 0) {
      jobListContainer.innerHTML = '<p>No jobs found.</p>'; // Display message if no jobs match the search
    } else {
      jobList.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job-item');

        jobElement.innerHTML = `
                    <h3 class="job-title">${job.designation}</h3>
                    <p class="company">${job.company}</p>
                    <p class="requirements">Requirements: ${job.requirements}</p>
                    <p class="salary">Salary: ${job.salary}</p>
                `;

        // Add click event to open modal


        jobListContainer.appendChild(jobElement);
      });
    }
  }
  // Function to open modal and set job details
  openModal(job: any) {
    this.visible = true;
    console.log(job);
    this.currentJob = job;
    console.log("Current",this.currentJob);
  }
}

export const jobs = [
  {
    'id': 1,
    'title': 'Software Engineer',
    'description': 'Develop and maintain web applications.',
    'requirements': '2+ years experience in software development, knowledge of Python and JavaScript.',
    'designation': 'Junior Software Engineer',
    'company': 'Tech Solutions',
    'location': 'New York',
    'salary': 80000,
    'skill_sets': ['Python', 'JavaScript', 'React'],
    'qualification': 'B.Tech',
    'year_of_passing': 2023,
    'percentage_criteria': '70%',
    'interview_mode': 'Online',
    'interview_rounds': 3,
    'url': 'https://techsolutions.com/careers'
  },
  {
    'id': 2,
    'title': 'Data Analyst',
    'description': 'Analyze and visualize data sets.',
    'requirements': 'Proficiency in SQL and Excel, experience with data visualization tools.',
    'designation': 'Data Analyst Intern',
    'company': 'DataCorp',
    'location': 'San Francisco',
    'salary': 70000,
    'skill_sets': ['SQL', 'Excel', 'Tableau'],
    'qualification': 'B.Sc',
    'year_of_passing': 2022,
    'percentage_criteria': '65%',
    'interview_mode': 'In-person',
    'interview_rounds': 2,
    'url': 'https://datacorp.com/careers'
  },
  {
    'id': 3,
    'title': 'Web Developer',
    'description': 'Build responsive websites and applications.',
    'requirements': 'Experience with HTML, CSS, and JavaScript, familiarity with front-end frameworks.',
    'designation': 'Front-end Web Developer',
    'company': 'WebWorks',
    'location': 'Austin',
    'salary': 75000,
    'skill_sets': ['HTML', 'CSS', 'JavaScript'],
    'qualification': 'B.Tech',
    'year_of_passing': 2023,
    'percentage_criteria': '70%',
    'interview_mode': 'Online',
    'interview_rounds': 2,
    'url': 'https://webworks.com/careers'
  },
  {
    'id': 4,
    'title': 'Machine Learning Engineer',
    'description': 'Develop ML models and algorithms.',
    'requirements': 'Strong background in statistics and machine learning algorithms.',
    'designation': 'Machine Learning Researcher',
    'company': 'AI Innovations',
    'location': 'Seattle',
    'salary': 90000,
    'skill_sets': ['Python', 'TensorFlow', 'Scikit-Learn'],
    'qualification': 'M.Tech',
    'year_of_passing': 2022,
    'percentage_criteria': '75%',
    'interview_mode': 'Online',
    'interview_rounds': 4,
    'url': 'https://aiinnovations.com/careers'
  },
  {
    'id': 5,
    'title': 'Project Manager',
    'description': 'Manage project timelines and deliverables.',
    'requirements': '5+ years experience in project management, PMP certification preferred.',
    'designation': 'Senior Project Manager',
    'company': 'Business Solutions',
    'location': 'Chicago',
    'salary': 100000,
    'skill_sets': ['Project Management'],
    'qualification': 'MBA',
    'year_of_passing': 2021,
    'percentage_criteria': '70%',
    'interview_mode': 'In-person',
    'interview_rounds': 3,
    'url': 'https://businesssolutions.com/careers'
  },
  {
    'id': 6,
    'title': 'UX/UI Designer',
    'description': 'Create user-friendly interfaces.',
    'requirements': 'Experience with design tools like Figma and Adobe XD.',
    'designation': 'UX/UI Designer Intern',
    'company': 'Design Studio',
    'location': 'Los Angeles',
    'salary': 70000,
    'skill_sets': ['Figma', 'Adobe XD'],
    'qualification': 'B.Des',
    'year_of_passing': 2023,
    'percentage_criteria': '65%',
    'interview_mode': 'In-person',
    'interview_rounds': 2,
    'url': 'https://designstudio.com/careers'
  },
  {
    'id': 7,
    'title': 'Network Engineer',
    'description': 'Design and implement network solutions.',
    'requirements': 'CCNA certification and knowledge of networking protocols.',
    'designation': 'Network Engineer Associate',
    'company': 'NetWorks',
    'location': 'Miami',
    'salary': 80000,
    'skill_sets': ['Networking'],
    'qualification': 'B.Tech',
    'year_of_passing': 2022,
    'percentage_criteria': '70%',
    'interview_mode': 'Online',
    'interview_rounds': 3,
    'url': 'https://networks.com/careers'
  },
  {
    'id': 8,
    'title': 'Quality Assurance Engineer',
    'description': 'Ensure product quality through testing.',
    'requirements': 'Experience in manual and automated testing.',
    'designation': 'Quality Assurance Tester',
    'company': 'Testify',
    'location': 'Boston',
    'salary': 60000,
    'skill_sets': ['QA Testing', 'Automation'],
    'qualification': 'B.Tech',
    'year_of_passing': 2022,
    'percentage_criteria': '60%',
    'interview_mode': 'In-person',
    'interview_rounds': 2,
    'url': 'https://testify.com/careers'
  },
  {
    'id': 9,
    'title': 'DevOps Engineer',
    'description': 'Implement and manage DevOps practices.',
    'requirements': 'Experience with CI/CD pipelines and cloud platforms.',
    'designation': 'DevOps Engineer Trainee',
    'company': 'Cloud Services',
    'location': 'Dallas',
    'salary': 90000,
    'skill_sets': ['AWS', 'Docker', 'Jenkins'],
    'qualification': 'B.Tech',
    'year_of_passing': 2023,
    'percentage_criteria': '75%',
    'interview_mode': 'Online',
    'interview_rounds': 4,
    'url': 'https://cloudservices.com/careers'
  },
  {
    'id': 10,
    'title': 'Cybersecurity Analyst',
    'description': 'Protect company data and systems.',
    'requirements': 'Knowledge of security protocols and threat analysis.',
    'designation': 'Cybersecurity Specialist',
    'company': 'SecureCorp',
    'location': 'Phoenix',
    'salary': 85000,
    'skill_sets': ['Cybersecurity'],
    'qualification': 'B.Tech',
    'year_of_passing': 2022,
    'percentage_criteria': '70%',
    'interview_mode': 'In-person',
    'interview_rounds': 3,
    'url': 'https://securecorp.com/careers'
  },
  {
    'id': 11,
    'title': 'Product Manager',
    'description': 'Lead product development from concept to launch.',
    'requirements': 'Experience in product management and working with cross-functional teams.',
    'designation': 'Associate Product Manager',
    'company': 'InnovateX',
    'location': 'Denver',
    'salary': 95000,
    'skill_sets': ['Product Management', 'Agile'],
    'qualification': 'MBA',
    'year_of_passing': 2022,
    'percentage_criteria': '70%',
    'interview_mode': 'Online',
    'interview_rounds': 3,
    'url': 'https://innovatex.com/careers'
  },
  {
    'id': 12,
    'title': 'Mobile App Developer',
    'description': 'Develop mobile applications for Android and iOS.',
    'requirements': 'Proficiency in Kotlin, Swift, and Flutter.',
    'designation': 'Mobile Developer Intern',
    'company': 'AppWorld',
    'location': 'San Diego',
    'salary': 80000,
    'skill_sets': ['Kotlin', 'Swift', 'Flutter'],
    'qualification': 'B.Tech',
    'year_of_passing': 2023,
    'percentage_criteria': '70%',
    'interview_mode': 'In-person',
    'interview_rounds': 2,
    'url': 'https://appworld.com/careers'
  },
  {
    'id': 13,
    'title': 'Cloud Architect',
    'description': 'Design cloud infrastructure and solutions.',
    'requirements': 'Experience with AWS, Azure, and cloud-based architecture.',
    'designation': 'Cloud Architect',
    'company': 'CloudSolutions',
    'location': 'Houston',
    'salary': 120000,
    'skill_sets': ['AWS', 'Azure', 'Cloud Architecture'],
    'qualification': 'M.Tech',
    'year_of_passing': 2021,
    'percentage_criteria': '75%',
    'interview_mode': 'Online',
    'interview_rounds': 3,
    'url': 'https://cloudsolutions.com/careers'
  },
  {
    'id': 14,
    'title': 'Graphic Designer',
    'description': 'Create visual content for digital and print media.',
    'requirements': 'Proficiency in Adobe Creative Suite and strong portfolio.',
    'designation': 'Graphic Designer Intern',
    'company': 'DesignCraft',
    'location': 'Portland',
    'salary': 65000,
    'skill_sets': ['Photoshop', 'Illustrator', 'InDesign'],
    'qualification': 'B.Des',
    'year_of_passing': 2023,
    'percentage_criteria': '65%',
    'interview_mode': 'In-person',
    'interview_rounds': 2,
    'url': 'https://designcraft.com/careers'
  },
  {
    'id': 15,
    'title': 'Systems Administrator',
    'description': 'Manage and maintain IT infrastructure.',
    'requirements': 'Experience with Linux and Windows server administration.',
    'designation': 'Systems Administrator',
    'company': 'IT Solutions',
    'location': 'Philadelphia',
    'salary': 85000,
    'skill_sets': ['Linux', 'Windows', 'Networking'],
    'qualification': 'B.Tech',
    'year_of_passing': 2022,
    'percentage_criteria': '70%',
    'interview_mode': 'Online',
    'interview_rounds': 2,
    'url': 'https://itsolutions.com/careers'
  },
  {
    'id': 16,
    'title': 'Content Writer',
    'description': 'Write engaging content for blogs, websites, and social media.',
    'requirements': 'Excellent writing and editing skills.',
    'designation': 'Content Writer Intern',
    'company': 'MediaHub',
    'location': 'Nashville',
    'salary': 55000,
    'skill_sets': ['Content Writing', 'SEO', 'Copywriting'],
    'qualification': 'B.A. in English',
    'year_of_passing': 2023,
    'percentage_criteria': '65%',
    'interview_mode': 'Online',
    'interview_rounds': 1,
    'url': 'https://mediahub.com/careers'
  },
  {
    'id': 17,
    'title': 'Blockchain Developer',
    'description': 'Develop decentralized applications and smart contracts.',
    'requirements': 'Proficiency in Solidity and blockchain platforms.',
    'designation': 'Blockchain Developer',
    'company': 'CryptoTech',
    'location': 'Las Vegas',
    'salary': 110000,
    'skill_sets': ['Solidity', 'Ethereum', 'Blockchain'],
    'qualification': 'B.Tech',
    'year_of_passing': 2022,
    'percentage_criteria': '75%',
    'interview_mode': 'Online',
    'interview_rounds': 3,
    'url': 'https://cryptotech.com/careers'
  },
  {
    'id': 18,
    'title': 'Business Analyst',
    'description': 'Analyze business requirements and create solutions.',
    'requirements': 'Experience in business process analysis and documentation.',
    'designation': 'Business Analyst Intern',
    'company': 'BizCorp',
    'location': 'Salt Lake City',
    'salary': 70000,
    'skill_sets': ['Business Analysis', 'Process Mapping', 'UML'],
    'qualification': 'MBA',
    'year_of_passing': 2022,
    'percentage_criteria': '70%',
    'interview_mode': 'In-person',
    'interview_rounds': 2,
    'url': 'https://bizcorp.com/careers'
  },
  {
    'id': 19,
    'title': 'Digital Marketing Specialist',
    'description': 'Create and implement digital marketing campaigns.',
    'requirements': 'Experience with Google Ads, SEO, and social media marketing.',
    'designation': 'Digital Marketing Executive',
    'company': 'MarketTech',
    'location': 'Charlotte',
    'salary': 65000,
    'skill_sets': ['SEO', 'Google Ads', 'Social Media Marketing'],
    'qualification': 'BBA',
    'year_of_passing': 2023,
    'percentage_criteria': '65%',
    'interview_mode': 'In-person',
    'interview_rounds': 1,
    'url': 'https://markettech.com/careers'
  },
  {
    'id': 20,
    'title': 'Full Stack Developer',
    'description': 'Develop and maintain full-stack applications.',
    'requirements': 'Proficiency in both front-end and back-end development.',
    'designation': 'Full Stack Developer',
    'company': 'DevHub',
    'location': 'San Jose',
    'salary': 95000,
    'skill_sets': ['JavaScript', 'Node.js', 'MongoDB'],
    'qualification': 'B.Tech',
    'year_of_passing': 2023,
    'percentage_criteria': '70%',
    'interview_mode': 'Online',
    'interview_rounds': 3,
    'url': 'https://devhub.com/careers'
  }

];








