# TickTock - Timesheet Management Application

A modern, user-friendly timesheet management application built with Next.js, TypeScript, and TailwindCSS. TickTock helps users track their work hours, manage tasks, and monitor project progress efficiently.

## Features

### 1. Authentication
- Secure user authentication using NextAuth
- Protected routes and API endpoints
- User session management
- Logout functionality

### 2. Dashboard
- Overview of all timesheets
- Weekly timesheet entries
- Status indicators (Completed, Incomplete, Missing)
- Total hours tracking against required hours (40 hours/week)
- Quick navigation to detailed timesheet views

### 3. Timesheet Management
- Detailed view for each timesheet
- Task grouping by date
- Real-time status updates
- Progress tracking with total hours calculation
- Cross-tab/window synchronization using localStorage

### 4. Task Management
- Add new tasks with description, duration, and project
- Edit existing tasks
- Delete tasks
- Form validation using Zod
- Loading states during submissions
- Real-time updates across all views

### 5. UI/UX Features
- Modern and clean interface using TailwindCSS
- Responsive design
- Interactive status badges
- Loading states and animations
- User-friendly error messages
- Accessible form controls

## Tech Stack

### Core Technologies
- **Frontend Framework**: Next.js 14.0.4
- **Language**: TypeScript 5.3.3
- **Styling**: TailwindCSS 3.4.1
- **State Management**: React Hooks, localStorage
- **Form Handling**: React Hook Form 7.49.2, Zod 3.22.4
- **Authentication**: NextAuth.js 4.24.5
- **Testing**: Jest 29.7.0, React Testing Library 14.1.2

### Additional Libraries
- **HTTP Client**: Axios 1.6.5
- **Date Handling**: date-fns 3.2.0
- **UI Components**: Headless UI 1.7.17
- **Icons**: Heroicons 2.1.1
- **Development Tools**: ESLint 8.56.0, Prettier 3.2.2

## Detailed Setup Instructions

### 1. System Requirements
- Node.js version 14.0.0 or higher
- npm version 6.14.0 or higher
- Git for version control
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### 2. Environment Setup

1. Install Node.js and npm:
   - Download from [Node.js official website](https://nodejs.org/)
   - Verify installation:
   ```bash
   node --version
   npm --version
   ```

2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TenTwenty
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### 3. Configuration

1. Create environment files:
   ```bash
   cp .env.example .env.local
   ```

2. Configure environment variables in `.env.local`:
   ```env
   # Base URL
   NEXT_PUBLIC_API_URL=http://localhost:3000
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   
   # Optional: External Service Keys
   # DATABASE_URL=your-database-url
   # SMTP_HOST=your-smtp-host
   ```

### 4. Database Setup (Development)
- The application uses localStorage for development
- For production, configure your preferred database in `.env.local`

### 5. Running the Application

1. Development mode:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Production build:
   ```bash
   npm run build
   npm start
   # or
   yarn build
   yarn start
   ```

3. Run tests:
   ```bash
   npm run test
   # or
   yarn test
   ```

### 6. Accessing the Application
- Development: [http://localhost:3000](http://localhost:3000)
- Default test credentials:
  - Email: user@example.com
  - Password: password

## Assumptions and Implementation Notes

### Data Storage
1. Development Environment:
   - Uses localStorage for data persistence
   - Data is retained between sessions
   - Cross-tab synchronization implemented

2. Production Considerations:
   - Would require proper database implementation
   - Suggested: PostgreSQL or MongoDB
   - Need to implement proper data backup

### Authentication
1. Current Implementation:
   - Uses NextAuth.js with simple credentials provider
   - JWT-based authentication
   - Session management through cookies

2. Security Considerations:
   - Implements CSRF protection
   - Uses secure HTTP-only cookies
   - Rate limiting on authentication endpoints

### Performance
1. Optimizations:
   - React component memoization
   - Lazy loading of components
   - Image optimization
   - Client-side caching

2. Limitations:
   - localStorage size limits
   - No offline support
   - Limited to browser storage

### Browser Support
- Modern browsers (last 2 versions)
- Chrome, Firefox, Safari, Edge
- No IE11 support

## Development Timeline and Time Tracking

### Phase 1: Initial Setup and Basic Features (Week 1)
- Project initialization and configuration (4 hours)
- Basic component structure (6 hours)
- Authentication implementation (8 hours)
- Dashboard layout (6 hours)

### Phase 2: Core Functionality (Week 2)
- Timesheet CRUD operations (10 hours)
- Form validation and error handling (8 hours)
- Data persistence implementation (6 hours)
- Status management (4 hours)

### Phase 3: UI/UX Improvements (Week 3)
- Responsive design implementation (8 hours)
- Component styling and animations (6 hours)
- Accessibility improvements (4 hours)
- Cross-browser testing (4 hours)

### Phase 4: Testing and Documentation (Week 4)
- Unit test implementation (10 hours)
- Integration testing (8 hours)
- Documentation (6 hours)
- Bug fixes and optimizations (8 hours)

Total Development Time: ~100 hours

## Project Structure

```
TenTwenty/
├── src/
│   ├── components/          # Reusable components
│   │   ├── TimesheetModal.tsx
│   │   └── ui/             # UI components
│   ├── pages/              # Next.js pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   └── dashboard/     # Dashboard pages
│   └── types/             # TypeScript types
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup
└── package.json          # Project dependencies
```

## Usage

### Authentication

1. Navigate to the login page
2. Sign in with your credentials
3. Upon successful authentication, you'll be redirected to the dashboard

### Managing Timesheets

1. View all timesheets on the dashboard
2. Click on a timesheet to view/edit details
3. Add new tasks using the "Add new task" button
4. Edit or delete tasks using the task menu (⋮)

### Task Management

1. Click "Add new task" on any date
2. Fill in the task details:
   - Description (min 3 characters)
   - Duration (in hours)
   - Project name (min 2 characters)
3. Submit the form
4. Edit tasks by clicking the menu icon and selecting "Edit"

## Testing

Run the test suite:
```bash
npm run test
# or
yarn test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

© 2024 tentwenty. All rights reserved. 

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js app with zero configuration.

1. **Prepare for Deployment**
   ```bash
   # Build your application locally to test
   npm run build
   ```

2. **Deploy to Vercel**
   - Create an account on [Vercel](https://vercel.com)
   - Install Vercel CLI:
     ```bash
     npm install -g vercel
     ```
   - Login to Vercel:
     ```bash
     vercel login
     ```
   - Deploy:
     ```bash
     vercel
     ```

   Alternatively, you can:
   - Push your code to GitHub
   - Import your repository in Vercel dashboard
   - Vercel will automatically deploy your application

   **Benefits of Vercel:**
   - Zero-configuration
   - Automatic HTTPS
   - CI/CD built-in
   - Automatic preview deployments
   - Edge Functions support
   - Built-in monitoring and analytics

### 2. Docker Deployment

1. **Create a Dockerfile**
   ```dockerfile
   # Base image
   FROM node:18-alpine

   # Create app directory
   WORKDIR /app

   # Install dependencies
   COPY package*.json ./
   RUN npm install

   # Copy source code
   COPY . .

   # Build application
   RUN npm run build

   # Expose port
   EXPOSE 3000

   # Start application
   CMD ["npm", "start"]
   ```

2. **Build and Run Docker Image**
   ```bash
   # Build image
   docker build -t ticktock .

   # Run container
   docker run -p 3000:3000 ticktock
   ```

3. **Deploy to Cloud Platforms**
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - Digital Ocean App Platform

### 3. Traditional Hosting (e.g., AWS, DigitalOcean)

1. **Prepare Application**
   ```bash
   # Build application
   npm run build

   # Install PM2 globally
   npm install -g pm2
   ```

2. **Server Setup**
   - Set up a Ubuntu/Debian server
   - Install Node.js and npm
   - Install and configure Nginx
   - Set up SSL with Let's Encrypt

3. **Deployment Process**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd TenTwenty

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "ticktock" -- start
   ```

4. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Environment Variables for Production

Create a `.env.production` file with the following variables:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL=your-database-url
```

### Production Checklist

1. **Security**
   - [ ] Set up proper environment variables
   - [ ] Enable HTTPS
   - [ ] Configure CORS policies
   - [ ] Set up rate limiting
   - [ ] Enable security headers

2. **Performance**
   - [ ] Enable caching
   - [ ] Configure CDN
   - [ ] Optimize images and assets
   - [ ] Enable compression

3. **Monitoring**
   - [ ] Set up error tracking (e.g., Sentry)
   - [ ] Configure performance monitoring
   - [ ] Set up logging
   - [ ] Enable uptime monitoring

4. **Backup**
   - [ ] Configure database backups
   - [ ] Set up disaster recovery plan
   - [ ] Document restore procedures

### Continuous Integration/Deployment (CI/CD)

1. **GitHub Actions Example**
   ```yaml
   name: Deploy
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run test
         - run: npm run build
         - uses: vercel/actions/cli@v2
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
   ```

2. **Automated Testing**
   - Run tests before deployment
   - Check code quality
   - Verify build process
   - Test environment variables 
