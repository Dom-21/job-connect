from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from flask import Flask, make_response, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import bcrypt
from flask import Flask, request, redirect
from flask_mail import Mail
from flask_session import Session
from dotenv import load_dotenv  
from flask_cors import CORS
import os

app = Flask(__name__)
# Allow Angular frontend to access any Flask route
CORS(app, resources={r"/*": {
    "origins": "http://localhost:4200",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}})



# Load environment variables
load_dotenv()

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:keebk123@localhost/job_portal'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)  # You can set your own secret key for sessions
app.config['SESSION_TYPE'] = 'filesystem'

# Initialize database and session
db = SQLAlchemy(app)
session=Session(app)

# User model
class User(db.Model):
    __tablename__ = 'users'  # Ensure this matches your actual table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)  # Optional field
    skills = db.Column(db.String(255), nullable=True)  # Optional field
    education = db.Column(db.String(255), nullable=True)  # Optional field
    year_of_passing = db.Column(db.String(20), nullable=True)  # Optional field
    percentage = db.Column(db.String(20), nullable=True)  # Optional field


# Job model
class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    company = db.Column(db.String(255))
    description = db.Column(db.Text)
    designation = db.Column(db.String(255))
    requirements = db.Column(db.Text)
    location = db.Column(db.String(255))
    salary = db.Column(db.String(100))
    skills = db.Column(db.String(255))
    qualification = db.Column(db.String(255))
    year = db.Column(db.String(20))
    percentage = db.Column(db.String(20))
    interviewMode = db.Column(db.String(100))
    interviewRounds = db.Column(db.String(100))
    careerPage = db.Column(db.String(300))


@app.route('/job_description')
def job_description():
    return render_template('job_description.html')

@app.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        print("Received signin data:", data)  # Debugging line to check received data
        email = data['email']
        password = data['password']

        # Find user by email
        user = User.query.filter_by(email=email).first()
        print("User found:", user)  # Debugging line to check if user is found
        if user:
            # Direct string comparison since passwords are not hashed
            if user.password == password:
                return jsonify({
                    'message': 'Signin successful!',
                    'user': {
                        'id': user.id,
                        'name': user.name,
                        'email': user.email,
                        'phone': user.phone,
                        'skills': user.skills,
                        'education': user.education,
                        'year_of_passing': user.year_of_passing,
                        'percentage': user.percentage
                    }
                })
            else:
                return jsonify({'error': 'Incorrect password'}), 401
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        print("Signin Error:", str(e))
        return jsonify({'error': 'Signin failed'}), 500


@app.route('/submit_job', methods=['POST'])
def submit_job():
    data = request.get_json()
    print("Received job data:", data)

    job = Job(
        title=data['title'],
        company=data['company'],
        description=data['description'],
        designation=data['designation'],
        requirements=data['requirements'],
        location=data['location'],
        salary=data['salary'],
        skills=data['skills'],
        qualification=data['qualification'],
        year=data['year'],
        percentage=data['percentage'],
        interviewMode=data['interviewMode'],
        interviewRounds=data['interviewRounds'],
        careerPage=data['careerPage']
    )
    db.session.add(job)
    db.session.commit()

    return jsonify({"status": "success", "message": "Job added successfully!"}), 200

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    try:
        # Get data from request
        data = request.get_json()
        print("Received signup data:", data)  # Debugging line to check received data
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        user = User(
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            phone=data.get('phone'),
            skills=data.get('skills'),
            education=data.get('education'),
            year_of_passing=data.get('year_of_passing'),
            percentage=data.get('percentage')

        )
        # Check if user already exists
        existing_user = User.query.filter_by(email=user.email).first()
        if existing_user:
            return jsonify({'message': 'User already exists'}), 200
        
        # Add and commit to the database
        db.session.add(user)
        db.session.commit()  # Explicitly commit the transaction

        return jsonify({'message': 'Signup successful!'})

    except Exception as e:
        print("Signup Error:", str(e))  # Print the error for debugging
        db.session.rollback()  # Rollback in case of error
        return jsonify({'error': 'Signup failed'}), 500

# Fetch and display all jobs
@app.route('/jobs', methods=['GET'])
def jobs():
    all_jobs = Job.query.all()
    # print("Raw DB Output:", all_jobs)
    jobs_data = [{
        'title': job.title,
        'company': job.company,
        'description': job.description,
        'location': job.location,
        'salary': job.salary,
        'skills': job.skills,
        'qualification': job.qualification,
        'year': job.year,
        'percentage': job.percentage,
        'interviewMode': job.interviewMode,
        'interviewRounds': job.interviewRounds,
        'careerPage': job.careerPage
    } for job in all_jobs]

    # print("Formatted Jobs Data:", jobs_data)  # Debugging line to check formatted data
    response = make_response(jsonify({"message": "Success",
                                      "data":{
                                            "jobs": jobs_data,
                                            "count": len(jobs_data) if jobs_data else 0
                                      }}), 200)
    response.headers["Content-Type"] = "application/json"
    return response

# Handle contact form submissions
@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    print("Received job data:", data)
    try:
        name = data['name']
        email = data['email']
        message = data['message']

        smtp_port = 587                 # Standard secure SMTP port
        smtp_server = "smtp.gmail.com"  # Google SMTP Server

        # Set up the email lists
        email_from = "keerthikori4@gmail.com"
        email_to = 'bhoomikakulkarni89@gmail.com'
        email_list = [email_to]

        # Define the password (better to reference externally)
        pswd =  "oaon esqt jdls xmvs"

        subject = 'This is a contact mail from Job Connect'

        # Define the email function (don't call it email!)
        def send_emails(email_list):

            for person in email_list:

                # Make the body of the email
                body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
                # make a MIME object to define parts of the email
                msg = MIMEMultipart()
                msg['From'] = email_from
                msg['To'] = person
                msg['Subject'] = subject

                # Attach the body of the message
                msg.attach(MIMEText(body, 'plain'))

                # Cast as string
                text = msg.as_string()

                # Connect with the server
                TIE_server = smtplib.SMTP(smtp_server, smtp_port)
                TIE_server.starttls()
                TIE_server.login(email_from, pswd)

                # Send emails to "person" as list is iterated
                TIE_server.sendmail(email_from, person, text)

            # Close the port
            TIE_server.quit()

        # Run the function
        send_emails(email_list)

        return jsonify({"status": "success", "message": "Email sent successfully!"}), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Print error for debugging
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000, debug=True)
