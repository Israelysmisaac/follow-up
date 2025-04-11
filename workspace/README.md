# Customer Follow-up System

An Angular application for tracking customer follow-ups with a focus on simplicity and usability.

## Features

- Track customers and their follow-up dates
- View today's follow-ups at a glance
- Easily set follow-up reminders for 7 days, 14 days, or 1 month later
- Local storage for data persistence
- Responsive design with Tailwind CSS

## Project Setup

### Prerequisites

- Node.js and npm installed
- Angular CLI installed (`npm install -g @angular/cli`)

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   ng serve
   ```
5. Open your browser and navigate to `http://localhost:4200`

## Usage

### Adding a New Customer

1. Click on "Add New Customer" in the navigation bar or on the customers page
2. Fill in the customer details
3. Set the next follow-up date manually or use the quick buttons
4. Click "Save"

### Managing Today's Follow-ups

1. Navigate to "Today's Follow-ups" to see all customers that need follow-up today
2. After contacting a customer, click on one of the follow-up buttons to set their next follow-up date
3. The customer will be removed from today's list

### Viewing All Customers

1. Navigate to "All Customers" to see the complete list
2. Use the edit or delete buttons to manage existing customers

## Data Storage

This application uses local storage to persist customer data in the browser. No server-side storage is used, so data remains on the user's device.

## License

This project is licensed under the MIT License.