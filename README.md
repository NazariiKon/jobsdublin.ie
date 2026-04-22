# Dublin Jobs Finder

A modern web application built for finding and managing job opportunities across Ireland — inspired by platforms like Indeed. Users can search for jobs, apply by uploading a CV, and employers can manage postings and candidates.

***

## 🌐 Live Demo
- **Frontend:** https://jobsdublin.onrender.com
- **Backend:** https://server--jobsdublin--4x9pscs9yhhk.code.run/docs

## Features

### 🌍 For Job Seekers
- Browse a **paginated list** of job vacancies.
- Use the **search bar** to filter by:
  - Job title, keyword, or company name.
  - City or district.
- Click a vacancy to view **full job details**.
- View company profiles.
- **Apply** for vacancies:
  - Requires login (via email or Google account).
  - Upload a CV (PDF) using file picker or drag-and-drop.
  - Preview uploaded CV before submission.
- Cannot apply to your own job postings.

### 🏢 For Employers
- Register an **Employer account**.
- Access a personalized **dashboard** to:
  - Edit company information.
  - Create, edit, or delete job listings.
  - View a list of applicants per vacancy.
  - Review applications and view CVs of candidates directly within the dashboard.
  - **Approve** or **Reject** job postings or applicants.

***

## Tech Stack

### Frontend
- **Framework:** React (with Vite & TypeScript)
- **Styling:** Tailwind CSS + Radix UI + Shadcn UI
- **State Management:** Redux Toolkit
- **Routing:** React Router
- **Form Handling:** React Hook Form + Zod validation
- **OAuth:** Google Login (`@react-oauth/google`)
- **File Upload:** React Dropzone
- **Dark Mode:** next-themes

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL (Async with SQLAlchemy + AsyncPG)
- **Authentication:** JWT + Google OAuth
- **Environment Handling:** python-dotenv
- **Server:** Uvicorn

***

## Deployment & Setup

### 1. Clone the repository
```bash
git clone https://github.com/NazariiKon/jobsdublin.ie.git
cd jobsdublin.ie
```

### 2. Generate JWT Keys
```bash
cd Backend
mkdir -p cert
openssl genrsa -out cert/private.key 2048
openssl rsa -in cert/private.key -pubout -out cert/public.key
```

### 3. Setup environment variables

#### Backend `.env`
Create a `.env` file inside the `Backend` folder:
```
DATABASE_URL=postgresql+asyncpg://docker:docker@database:5432/jobsdublinDB
```

#### Frontend `.env`
Create a `.env` file inside the `Frontend` folder:
```
VITE_API_URL=http://localhost:8000
```

### 4. Run Docker
Build and start the containers:
```bash
docker-compose up -d --build
```

### 5. Initialize database data
- Open API docs at [http://localhost:8000/docs](http://localhost:8000/docs)
- Use the initialization endpoints to:
  1. Create database tables.
  2. Insert fake data for testing.

***

## Project Structure

```
.
├── Backend/
│   ├── src/
│   ├── cert/
│   ├── .env
│   └── requirements.txt
├── Frontend/
│   ├── src/
│   ├── .env
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

***

## Screenshots

![Home Page](./screenshots/home_page.png)
**Main page with job listings, search and pagination**



![Search Jobs](./screenshots/search_jobs.png)
**Job search results by keyword and location**



![Sign In Google](./screenshots/sign_in_via_google.png)
**Google OAuth login**



![Apply Drag & Drop](./screenshots/user_apply_noCV_DandD_zone.png)
**CV upload zone with drag & drop**



![Apply CV Preview](./screenshots/user_apply_cv.png)
**Uploaded CV preview before submission**



![Company Page](./screenshots/created_company_page.png)
**Job details with company profile**



![Employer Dashboard](./screenshots/employer_vacancy_list.png)
**Employer dashboard with active vacancies**



![Employer Applications](./screenshots/employers_vacancy_applications_page.png)
**Review job applications and candidate CVs**
