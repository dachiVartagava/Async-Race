# Async Race - SPA Racing Game

- **Deployed Application Link**: https://asyncrace.vercel.app
- **Self-Estimated Score**: 400 / 400 pts

---

## Technical Overview

- **Framework & Language**: React v18+ implemented with TypeScript in strict mode.
- **State Management**: Redux Toolkit is used to handle global state and maintain UI persistence between view switches.
- **Asynchronous Operations**: Uses Promise.all to trigger parallel API requests for the race mode and implements custom timeouts to handle engine logic, including simulated 500 server errors.

---

## Requirements Checklist

### Basic Structure (80/80 pts)
- [x] **Two Views**: "Garage" and "Winners" views are successfully implemented.
- [x] **Garage View Content**: Displays view name, car creation and editing panels, race controls, and the garage grid.
- [x] **Winners View Content**: Displays view name, high-score statistics table, and pagination controls.
- [x] **Persistent State**: Current page numbers, user input fields, and parameters remain unchanged when shifting between views.

### Garage View (90/90 pts)
- [x] **CRUD Operations**: Users can create, update, select, and delete cars.
- [x] **Color Selection**: Integrated RGB-compatible color picker dynamically styles the car SVG icon.
- [x] **Random Car Creation**: Generates 100 random cars per click with randomly assembled names and colors.
- [x] **Car Management Buttons**: Action buttons are present for every car item to update attributes or delete it.
- [x] **Pagination**: Displays exactly 7 cars per page.
- [x] **Extra Features**: Handled empty garage state with a user-friendly message, and automatically navigates to the previous page if the last car on the current page is deleted.

### Winners View (50/50 pts)
- [x] **Display Winners**: Records data permanently and updates database records upon completion of any race.
- [x] **Pagination for Winners**: Displays exactly 10 winner records per page.
- [x] **Winners Table**: Renders Rank, Car Icon, Name, Wins tracker, and Best Time metrics accurately.
- [x] **Sorting Functionality**: Full server-side sorting supported for wins count and best time via API query parameters.

### Race Mode (170/170 pts)
- [x] **Start Engine Animation**: The animation calculates duration dynamically using response velocity. Successfully catches simulated 500 errors to stop broken vehicles mid-track.
- [x] **Stop Engine Animation**: Halts running animations immediately and returns the vehicle to its default starting position.
- [x] **Responsive Animation**: Track animations are responsive and scale fluidly for viewport sizes down to 500px.
- [x] **Start/Reset Race Buttons**: Full-page synchronization to start or reset the race for all cars on the current page.
- [x] **Winner Announcement**: Renders a text message with the name of the winning car as soon as it finishes first.
- [x] **Button States & Race Rules**: Conditional attributes lock inputs, pagination, car modifications, and view navigation while a race is active to ensure predictable application flow.

### Configuration (10/10 pts)
- [x] **Prettier & ESLint**: Formatting and strict typing constraints are fully enforced via package scripts.

---

## Local Setup

1. Clone the frontend repository to your local machine.
2. Ensure the unmodified mock backend server is running locally on `http://127.0.0.1:3000`.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the local development server.