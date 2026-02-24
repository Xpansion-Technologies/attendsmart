# AGENTS.md

## Project Overview: Bus Attendance Admin Module

This project aims to build a modern, user-friendly online administration module for a bus attendance system. It will feature an intuitive interface for managing students, buses, attendance, drivers, and parents, specifically branded for **Delhi Public School (DPS) Greater Noida**.

### Objectives

- **Modern UI/UX**: Use a robust UI library (ShadCN UI) to ensure a professional and accessible interface.
- **Branding**: Align with the DPS Greater Noida website's visual identity (Teal/Blue #004b61, Cream/Beige #f4f1ea, Green/White).
- **Modularity**: Implement a clear component and module system to enhance maintainability and readability.
- **Performance**: Adhere to Vercel React best practices to ensure optimal client-side performance and efficient data fetching.
- **Composition**: Use React composition patterns (Compound Components, Lifting State) to keep the codebase flexible and scalable.

### Core Modules

1.  **Dashboard**: Overview of daily attendance, active buses, and key metrics. (Supabase Realtime)
2.  **Students Management**: CRUD operations via Supabase for student records.
3.  **Buses Management**: Fleet management with driver associations.
4.  **Attendance**: Real-time tracking and historical logs stored in Supabase.
5.  **Drivers/Staff**: Authentication and role-based access control (Admin, Teacher, Driver).
6.  **Parents/Guardians**: Secure contact database.

### Project Directory Structure

```text
src/
├── assets/             # Images, logos (DPS logo), and global assets
├── components/         # Shared, low-level UI components (Buttons, Inputs, Modals)
│   ├── ui/             # ShadCN UI base components
│   └── shared/         # Custom shared components (Layout, Sidebar, Navbar)
├── hooks/              # Custom React hooks (useAttendance, useAuth, etc.)
├── modules/            # Domain-specific logic and complex components
│   ├── dashboard/      # Dashboard with charts and live tracking
│   ├── attendance/     # Attendance tracking logic and views
│   ├── students/       # Student management logic and views
│   ├── buses/          # Bus management logic and views
│   ├── drivers/        # Driver management logic and views
│   └── parents/        # Parent/Guardian management logic and views
├── pages/              # Top-level page components and routing
├── services/           # Supabase client and data fetching logic
├── styles/             # Global CSS, Tailwind configuration, and themes
├── types/              # TypeScript interfaces and Database types (Supabase)
└── utils/              # Helper functions and constants
```

### Integrated Skills

This project leverages specialized agent skills to ensure high code quality and best practices:

- **Supabase**: Backend-as-a-Service for Auth (Login/Logout), Database, and Realtime updates.
- **Authentication**: Implemented via Supabase Auth with custom `profiles` management.
- **vercel-composition-patterns**: Ensures flexible and maintainable component architecture, avoiding prop drilling and boolean prop explosion.
- **vercel-react-best-practices**: Guides performance optimization, efficient rendering, and bundle size management.
- **web-design-guidelines**: Ensures compliance with accessibility (a11y), responsive design, and general UI/UX best practices.

### Implementation Guidelines

- **Atomic Design**: Build small, reusable components in `src/components/ui`.
- **Composition over Inheritance**: Use the `children` prop and compound components for complex UI elements.
- **Early Fetching**: Start data promises as early as possible to eliminate waterfalls.
- **Branding**: Use CSS variables or Tailwind's theme configuration to enforce the DPS color palette consistently.
- **TypeScript**: Strictly type all props, state, and API responses.
