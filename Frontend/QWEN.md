# QWEN.md

This file provides guidance to Qwen Code when working with code in this repository.

## Overview

This is a SEBI compliance and legal document processing system built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI components. The system analyzes legal clauses in documents and verifies their compliance against SEBI regulations using multiple LLM providers and vector similarity search.

**Key Features:**
- Multi-LLM Support: Claude, Gemini, OpenAI, and Mistral integration
- Legal-BERT Embeddings: Specialized legal language model for semantic understanding
- Vector Similarity Search: BigQuery-powered regulation retrieval using cosine similarity
- Risk Assessment: Automated categorization and scoring of compliance risks
- Cloud-Native: Built on Google Cloud Platform for scalability
- Modern UI: Next.js 14 with TypeScript, Tailwind CSS, and Shadcn UI components

## Key Dependencies and Environment Setup

Install dependencies with:
```bash
npm install
# or
yarn install
# or
pnpm install
```

Key dependencies include:
- `next` 14 with App Router
- `react` 18 with hooks
- `tailwindcss` for styling
- `@radix-ui` primitives for accessible components
- `lucide-react` for icons
- `recharts` for data visualization
- `gsap` for animations
- `@tanstack/react-query` for data fetching
- `react-hook-form` for form handling
- `zod` for validation

Environment variables needed in `.env.local`:
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., http://localhost:8000)

## System Architecture

The frontend follows a feature-based architecture with reusable UI components and modern Next.js App Router:

### Core Components

1. **Landing Page** (`app/page.tsx`)
   - Modern marketing page with animated hero section using GSAP
   - Feature highlights with icons and descriptions
   - Call-to-action buttons for getting started
   - Responsive design with mobile optimization
   - Clean, professional layout with gradient backgrounds

2. **Dashboard** (`app/dashboard/page.tsx`)
   - Comprehensive compliance dashboard with:
     - File upload component with drag-and-drop functionality
     - Statistics cards showing compliance metrics (total documents, risk assessments, etc.)
     - Recent activity timeline with status indicators
     - Compliance analytics charts using Recharts
     - LLM provider selector for multi-model support
     - Risk assessment visualization
     - Interactive data tables for document management

3. **Document Upload** (`features/document-upload/`)
   - Advanced drag-and-drop file upload component
   - File validation and progress indicators
   - Support for multiple file formats (PDF, DOCX, TXT)
   - Upload status management with real-time feedback
   - Error handling for invalid files

4. **Compliance Dashboard** (`features/compliance-dashboard/`)
   - Interactive compliance charts and visualizations
   - LLM provider selector with support for Claude, Gemini, OpenAI, Mistral
   - Risk level indicators and scoring system
   - Data visualization using Recharts library
   - Filtering and sorting capabilities

5. **Error Handling & Loading States**
   - Global error boundary (`app/error.tsx`) for application errors
   - Custom 404 page (`app/not-found.tsx`) for better user experience
   - Loading states (`app/loading.tsx`) with skeleton components
   - Graceful degradation for API failures

### Project Structure

```
Frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/page.tsx        # Login page
│   │   ├── signup/page.tsx       # Signup page
│   │   └── layout.tsx            # Auth layout
│   ├── dashboard/                # Main dashboard pages
│   │   ├── page.tsx              # Dashboard home
│   │   ├── documents/page.tsx    # Document management
│   │   ├── analysis/[id]/page.tsx # Document analysis detail
│   │   ├── profile/page.tsx      # User profile
│   │   └── layout.tsx            # Dashboard layout
│   ├── help/                     # Help pages
│   │   └── page.tsx              # Help documentation
│   ├── error.tsx                 # Global error boundary
│   ├── loading.tsx               # Global loading state
│   ├── not-found.tsx             # Custom 404 page
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── providers.tsx             # React context providers
├── components/                   # Shared UI components
│   ├── shared/                   # Shared application components
│   └── ui/                       # Shadcn UI components
│       ├── button.tsx            # Enhanced button component
│       ├── input.tsx             # Form input component
│       ├── skeleton.tsx          # Loading skeleton component
│       └── ...                  # Other UI primitives
├── features/                     # Feature-based organization
│   ├── compliance-dashboard/     # Dashboard components
│   │   ├── ComplianceChart.tsx   # Chart visualization
│   │   └── LLMProviderSelector.tsx # Model selector
│   └── document-upload/          # Upload components
│       └── FileUpload.tsx        # Drag-and-drop upload
├── hooks/                        # Custom React hooks
│   └── use-compliance.ts         # Compliance data hook
├── lib/                          # Utility functions and API clients
│   ├── api.ts                    # API client configuration
│   ├── mock-services.ts          # Development mock data
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── styles/                       # Global styles
└── tests/                        # Test files (Jest & Playwright)
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Frontend available at http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run end-to-end tests with UI
npm run test:e2e:ui
```

## UI Component Library

This project uses Shadcn UI components which are built on top of Radix UI primitives. Components are located in `components/ui/` directory.

Key components implemented:
- `Button` - Primary and secondary buttons with variants (default, destructive, outline, secondary, ghost, link)
- `Card` - Content containers for dashboard sections
- `Badge` - Status indicators for compliance levels
- `Input` - Enhanced form inputs with validation
- `Skeleton` - Loading placeholders for better UX
- `Tabs` - Tabbed navigation (ready for implementation)
- `Dialog` - Modal dialogs (ready for implementation)
- `DropdownMenu` - Context menus (ready for implementation)
- `Toast` - Notification messages (ready for implementation)

## Styling

The project uses Tailwind CSS for styling with a custom configuration in `tailwind.config.js`. Key features include:

- Dark mode support
- Custom color palette
- Responsive design utilities
- Animation utilities

## API Integration

The frontend communicates with the backend API using:
- `@tanstack/react-query` for data fetching and caching
- `axios` for HTTP requests
- Custom hooks for API endpoints

Base API URL is configured through environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing

### Current State
The project includes setup for both unit testing (Jest) and end-to-end testing (Playwright).

### Testing Strategy
- **Unit Tests**: Jest with React Testing Library for components and hooks
- **E2E Tests**: Playwright for critical user flows
- **Component Tests**: Test individual components in isolation

## Recent Updates and Improvements

### Authentication System
- **Complete Implementation**: Full login/signup flow with JWT authentication
- **Protected Routes**: Middleware for dashboard protection
- **Session Management**: Context-based session handling
- **Cookie Management**: Unified cookie handling across components

### Dashboard Features
- **Enhanced File Upload**: Improved drag-and-drop with better feedback
- **Analytics Dashboard**: Interactive charts with Recharts
- **LLM Provider Selector**: Multi-model support interface
- **Document Management**: History and analysis pages

### Performance Improvements
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Components loaded on demand
- **Caching**: React Query for data caching
- **Skeleton Loading**: Better perceived performance

### Error Handling
- **Global Error Boundary**: Catch and display application errors
- **API Error Handling**: Comprehensive error states
- **Fallback UI**: Graceful degradation for failed components

### Route Files
- `app/page.tsx` - Modern landing page with GSAP animations and marketing content
- `app/dashboard/page.tsx` - Comprehensive dashboard with upload, analytics, and data management
- `app/dashboard/documents/page.tsx` - Document management interface
- `app/dashboard/analysis/[id]/page.tsx` - Document analysis detail view
- `app/layout.tsx` - Root layout with global providers and styling
- `app/providers.tsx` - React Query and other context providers
- `app/error.tsx` - Global error boundary for better error handling
- `app/loading.tsx` - Global loading state with skeleton components
- `app/not-found.tsx` - Custom 404 page

### Feature Modules
- `features/document-upload/components/FileUpload.tsx` - Advanced drag-and-drop file upload
- `features/compliance-dashboard/components/ComplianceChart.tsx` - Interactive compliance visualization with Recharts
- `features/compliance-dashboard/components/LLMProviderSelector.tsx` - Multi-LLM provider selector

### Custom Hooks
- `hooks/use-compliance.ts` - React hook for compliance data management

### Utility Libraries
- `lib/api.ts` - API client with error handling and request/response types
- `lib/mock-services.ts` - Mock data services for development
- `lib/utils.ts` - Utility functions and class name helpers

### UI Components
- `components/ui/button.tsx` - Enhanced button component with multiple variants
- `components/ui/input.tsx` - Form input component with validation support
- `components/ui/skeleton.tsx` - Loading skeleton components for better UX

### Recent Enhancements (September 2025)
- **Improved Navbar**: Enhanced navigation component with better responsive design
- **Authentication Context**: Refined session management and token handling
- **Login Page**: Updated UI with improved form validation and error handling
- **Dashboard Updates**: Enhanced statistics display and real-time processing updates

## Backend Integration

The frontend connects to a Python/FastAPI backend that handles:
- Legal-BERT embeddings for clause analysis
- BigQuery integration for regulation retrieval
- Multi-LLM verification (Claude, Gemini, OpenAI, Mistral)
- Risk assessment and scoring

API endpoints:
- `POST /api/v1/compliance/verify` - Verify document compliance
- `POST /api/v1/compliance/upload` - Upload documents for processing
- `GET /api/v1/compliance/results/{id}` - Get compliance results

## Deployment

The frontend can be deployed to Vercel with zero configuration or to any static hosting provider after building.

Build command:
```bash
npm run build
```

Output directory: `.next`

## Current Status

### Completed Features ✅
- ✅ Modern, responsive landing page with GSAP animations
- ✅ Comprehensive dashboard layout with statistics and charts
- ✅ Advanced file upload with drag-and-drop functionality
- ✅ LLM provider selector (Claude, Gemini, OpenAI, Mistral)
- ✅ Interactive compliance charts using Recharts
- ✅ Error handling with global error boundaries
- ✅ Loading states with skeleton components
- ✅ Custom 404 page
- ✅ Mock data services for development
- ✅ TypeScript configuration with strict typing
- ✅ Tailwind CSS with custom design system
- ✅ Shadcn UI component integration
- ✅ Authentication system (login/signup pages)
- ✅ Backend API integration
- ✅ Document history and management interface
- ✅ Advanced filtering and search functionality
- ✅ Real-time processing updates
- ✅ Enhanced navigation and responsive design

### Development History

**Phase 1: Foundation (Completed)**
1. ✅ Modern Next.js 14 setup with App Router
2. ✅ Comprehensive UI component library
3. ✅ Dashboard and landing page implementation
4. ✅ Mock services for development

**Phase 2: Enhanced Features (Completed)**  
1. ✅ Authentication system (login/signup pages)
2. ✅ Backend API integration
3. ✅ Document history and management interface
4. ✅ Advanced filtering and search functionality
5. ✅ Real-time processing updates

**Phase 3: Production Readiness (In Progress)**
1. 🔄 Comprehensive testing suite (unit + E2E)
2. 🔄 Performance optimization and code splitting
3. 🔄 SEO optimization and metadata
4. 🔄 Security enhancements
5. 🔄 Monitoring and analytics integration

## Design Consistency

Always maintain design consistency across answers, documents, and code.

Use clean, modular structure and avoid clutter.

Follow a minimal, modern aesthetic with proper spacing, typography, and alignment.

Stick to a consistent naming convention (camelCase for code, Title Case for docs).

For UI/UX: prioritize clarity, accessibility, responsiveness, and grid-based layouts.

For explanations: be concise, structured (use bullet points, numbered steps, or headers).

Always check that the output matches previous style decisions unless explicitly asked to change.

If unsure, ask for clarification instead of guessing.