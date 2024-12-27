LineOps - Automotive Work Order Management System
Overview

LineOps is a React-based automotive work order management system. It provides a Kanban-style interface for tracking work orders across different stages with real-time analytics.
Key Features

    Kanban Board: Drag-and-drop work order management across three states (Pending, In Progress, Complete)
    Real-time Analytics: Visual charts showing work order status, department distribution, and car status
    Search Functionality: Universal search across work orders, cars, and users
    Role-based Access: Admin and standard user permissions
    Modal Forms: Intuitive forms for creating/editing work orders, cars, and users

Technical Stack

    Frontend: React 18.3 with Vite
    State Management: React Hooks & Context
    Routing: React Router v7
    Charts: Recharts

Setup & Installation

# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Create .env file
VITE_BACKEND_URL=https://your-backend-url.com

# Start development server
npm run dev

# Build for production
npm run build

Core Components

    Authentication
    Login system with JWT tokens
    Protected routes for authenticated users
    Role-based access control
    Dashboard
    Work order Kanban board
    Real-time analytics charts
    Search functionality
    Create/Edit modals for:
    Work Orders
    Cars
    Users (Admin only)
    Status tracking
    Task management
    Department assignment
    Car association
    Technician assignment

