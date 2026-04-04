# DockerHub Deployment Instructions

To push the project images to DockerHub for reporting, follow these steps:

## 1. Login to DockerHub
Open your terminal and run:
`docker login`
*(Enter your username and password when prompted)*

## 2. Build and Tag Images
Replace `YOUR_USERNAME` with your real DockerHub username.

### Backend
`docker build -t YOUR_USERNAME/doanck-backend ./backend`

### Frontend
`docker build -t YOUR_USERNAME/doanck-frontend .`

## 3. Push to DockerHub

### Backend
`docker push YOUR_USERNAME/doanck-backend`

### Frontend
`docker push YOUR_USERNAME/doanck-frontend`

## 4. Verify
Check your DockerHub profile to see the new repositories: `doanck-backend` and `doanck-frontend`.
