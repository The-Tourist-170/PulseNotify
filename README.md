# Alerting & Notification Platform

A comprehensive platform for creating, managing, and delivering targeted alerts and notifications. This system balances powerful admin configurability with a user-centric approach to ensure important information is seen without overwhelming users.

-----

## 📋 Table of Contents

  * [About The Project](https://www.google.com/search?q=%23-about-the-project)
  * [✨ Key Features](https://www.google.com/search?q=%23-key-features)
  * [🛠️ Tech Stack](https://www.google.com/search?q=%23%EF%B8%8F-tech-stack)
  * [🏗️ System Design & Architecture](https://www.google.com/search?q=%23%EF%B8%8F-system-design--architecture)
  * [🚀 Getting Started](https://www.google.com/search?q=%23-getting-started)
  * [🔌 API Endpoints](https://www.google.com/search?q=%23-api-endpoints)
  * [☁️ Deployment](https://www.google.com/search?q=%23%EF%B8%8F-deployment)
  * [🔭 Future Scope](https://www.google.com/search?q=%23-future-scope)

-----

## 📖 About The Project

Modern organizations depend on timely notifications for events like system outages, policy updates, and general announcements. However, a common challenge is that users often miss or ignore non-persistent notifications, while administrators lack granular control over who receives specific alerts.

This project solves that problem by providing a lightweight yet powerful system where admins can configure alerts with specific visibility rules, and users receive persistent reminders until an alert is acknowledged. The core goal is to build a clean, extensible, and modular system following best practices in Object-Oriented Design.

-----

## ✨ Key Features

### For Admins 🧑‍💻

  * **Create Unlimited Alerts**: Admins can create alerts with a **Title**, **Message Body**, and **Severity** (Info, Warning, Critical).
  * **Configure Visibility**: Target alerts to the right audience by setting visibility to:
      * The **Entire Organization**
      * Specific **Teams** (e.g., Engineering, Marketing)
      * Specific **Users**
  * **Manage Alert Lifecycle**: **Update** or **archive** existing alerts, set **start and expiry times**, and **enable or disable** reminders for any alert.
  * **Monitor Alerts**: View a list of all created alerts and filter them by severity, status, or audience.

### For End Users 🙋‍♀️

  * **Receive Targeted Notifications**: Get only the alerts relevant to you based on your organization, team, or user-specific assignments.
  * **Persistent Reminders**: Alerts re-trigger **every 2 hours** until they are snoozed for the day or expire, ensuring you never miss a critical update.
  * **Snooze Functionality**: Snooze an alert for the current day to pause reminders. Reminders will automatically resume the next day if the alert is still active.
  * **Alerts Dashboard**: View all active alerts, mark them as **read/unread**, and check your history of snoozed alerts.

### Shared Features 📊

  * **Analytics Dashboard**: A system-wide dashboard showing key metrics like total alerts created, read vs. delivered rates, snooze counts per alert, and a breakdown by severity.

-----

## 🛠️ Tech Stack

This project is built using a modern, full-stack architecture.

  * **Backend**:
      * **Java** with **Spring Boot**: For building robust, scalable, and secure REST APIs.
      * **PostgreSQL**: A powerful, open-source object-relational database system.
  * **Frontend**:
      * **React.js**: A JavaScript library for building user interfaces.
      * **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
      * **Framer Motion**: For production-ready animations and gestures.
      * **Lucide React**: For beautiful and consistent icons.
  * **Deployment**:
      * **Backend**: **Render**
      * **Frontend**: **Firebase Hosting**

-----

## 🏗️ System Design & Architecture

The system is designed with clean OOP principles to ensure it is extensible and easy to maintain.

  * **Single Responsibility Principle (SRP)**: Each module has a distinct responsibility—separating alert management from notification delivery and user preferences.
  * **Extensibility**: The architecture is future-proof. For example, new notification channels (like Email or SMS) can be added without modifying existing delivery logic, likely using the **Strategy Pattern**.
  * **Design Patterns**: The design anticipates the use of key OOP patterns:
      * **Strategy Pattern** for handling different notification channels (In-App, Email, etc.).
      * **Observer Pattern** for allowing users to subscribe to relevant alert streams.
      * **State Pattern** for managing the complex states of an alert (e.g., active, snoozed, read, unread).

-----

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * **Node.js** & **npm** (for Frontend)
  * **Java 17+** & **Maven** (for Backend)
  * **PostgreSQL** instance running locally or on the cloud.
  * **Git** for version control.

### Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone https://your-repo-url.git
    ```
2.  **Navigate to the backend directory:**
    ```sh
    cd server
    ```
3.  **Configure your database** in `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/your_db_name
    spring.datasource.username=your_db_user
    spring.datasource.password=your_db_password
    spring.jpa.hibernate.ddl-auto=update
    ```
4.  **Install dependencies and run the server:**
    ```sh
    mvn spring-boot:run
    ```
    The server will start on `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd client
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Create a `.env.local` file** and add the backend API URL:
    ```
    VITE_API_BASE_URL=http://localhost:8080
    ```
4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

-----

## 🔌 API Endpoints

The backend provides the following RESTful APIs.

| HTTP Method | Endpoint                       | Description                                | Authorized Role |
| :---------- | :----------------------------- | :----------------------------------------- | :-------------- |
| `POST`      | `/api/alerts`                  | Create a new alert.             | Admin           |
| `PUT`       | `/api/alerts/{id}`             | Update an existing alert.       | Admin           |
| `GET`       | `/api/alerts`                  | Get a list of all alerts.       | Admin           |
| `GET`       | `/api/users/me/alerts`         | Fetch all active alerts for the user. | User            |
| `POST`      | `/api/alerts/{id}/read`        | Mark an alert as read/unread.   | User            |
| `POST`      | `/api/alerts/{id}/snooze`      | Snooze an alert for the day.    | User            |
| `GET`       | `/api/analytics`               | Get system-wide alert analytics.| Admin           |

-----

## ☁️ Deployment

The application is deployed with a decoupled front-end and back-end architecture:

  * **Backend (Spring Boot)**: Deployed on **Render**.
      * Live URL: `[Link to Live Backend API]`
  * **Frontend (React)**: Deployed on **Firebase Hosting**.
      * Live URL: `[Link to Live Frontend App]`

-----

## 🔭 Future Scope

The application is built to be extensible. Future enhancements could include:

  * **Additional Delivery Channels**: Adding support for **Email** and **SMS** notifications.
  * **Customizable Reminders**: Allowing admins to set custom reminder frequencies instead of the default 2 hours.
  * **Scheduled & Escalating Alerts**: Implementing cron-based scheduling and severity escalations for unacknowledged alerts.
  * **Push Notifications**: Integrating with push notification services for real-time mobile alerts.
  * **Role-Based Access Control (RBAC)**: More granular permissions for admin features.
