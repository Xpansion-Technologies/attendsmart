# AttendSmart - Bus Attendance Admin Module

A modern, high-performance, and user-friendly administration dashboard for managing student bus attendance, specifically designed for **Delhi Public School (DPS) Greater Noida**.

## 🚀 Overview

AttendSmart is a comprehensive solution for schools to monitor and manage their transportation fleet. It provides real-time visibility into student boarding, bus routes, driver performance, and guardian communication, all wrapped in a professional and accessible interface.

### Key Objectives
- **Real-Time Visibility**: Instant updates on student boarding/deboarding.
- **Efficient Fleet Management**: Manage routes, shifts, and driver assignments seamlessly.
- **Enhanced Safety**: Direct links between students, parents, and drivers for rapid communication.
- **Data-Driven Insights**: Visualize attendance trends and bus capacities via interactive dashboards.

## ✨ Features

- **📊 Live Dashboard**: Real-time stats, interactive student attendance charts (Bar Charts), and shift distribution (Donut Charts) via Recharts.
- **👥 Student Management**: Full CRUD operations for student records, including class assignment, guardian links, and bus routing.
- **🚍 Bus Fleet Control**: Track bus numbers, routes, and shifts (Morning/Afternoon/Evening) with capacity monitoring.
- **📅 Attendance Summary**: Trip-based attendance logs with detailed student status (Present/Absent) and scan times.
- **👨‍✈️ Driver Portal**: Manage driver credentials, contact information, and assigned bus schedules.
- **🛡️ Parent/Guardian Management**: Secure database of contact details and home addresses for every student.
- **🗺️ Live Bus Tracking (Mock)**: Visual tracking of the fleet on an interactive map with status indicators (Moving/Delayed/Stopped).
- **📋 Popup Modals**: Clean, soft-shadowed modals for all entry and edit forms, ensuring a seamless user experience.
- **📱 Responsive Design**: Fully responsive layout optimized for desktop and tablet administrative use.

## 🎨 UI Library & Tech Stack

AttendSmart is built using the latest modern web technologies:

- **React 19**: Leveraging the newest features for performance and scalability.
- **TypeScript**: Ensuring type safety and robust code architecture.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: For utility-first, highly customizable styling.
- **Lucide React**: A beautiful and consistent icon library for modern UI design.
- **Recharts**: For responsive and interactive data visualizations.
- **Custom UI Components**: Built using **React Composition Patterns** (Compound Components, Lifting State) to ensure flexibility and maintainability.

## 🛠️ Getting Started Locally

To get started with AttendSmart on your local machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/attendsmart.git
   cd attendsmart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🗺️ Project Roadmap

- [x] **Phase 1: Foundation**: Initialize React/Vite project with Tailwind and core UI components.
- [x] **Phase 2: Management Modules**: Complete CRUD for Students, Buses, Drivers, and Parents.
- [x] **Phase 3: Visual Analytics**: Integrated Recharts for live dashboard metrics.
- [x] **Phase 4: Attendance Logic**: Detailed trip-based summary and student boarding logs.
- [ ] **Phase 5: Real-time GPS Integration**: Hardware synchronization for live GPS data and NFC/QR scanning.
- [ ] **Phase 6: Notifications**: SMS and Push notifications for parents when students board or deboard.
- [ ] **Phase 7: AI Route Optimization**: Intelligent routing to reduce fuel consumption and travel time.
- [ ] **Phase 8: Mobile Apps**: Dedicated apps for Drivers (Attendance Scanning) and Parents (Live Tracking).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for **Delhi Public School (DPS) Greater Noida**.
