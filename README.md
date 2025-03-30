
# YiNiann's Navigation App

Welcome to **YiNiann's Navigation App**, a simple navigation web app that allows users to switch between dark mode and light mode while browsing. It includes a set of custom cards to quickly access useful links and a navigation bar to explore the app's sections.

## Features

- **Dark Mode / Light Mode**: Toggle between dark and light themes throughout the app.
- **Dynamic Cards**: Users can view and add custom cards with a title, description, URL, and button text.
- **React Router**: Simple routing for navigating between Home, About, and Contact pages.
- **Redux**: Manages dark mode state globally.


## Technologies Used

- **React**: Front-end JavaScript library for building the user interface.
- **Redux**: State management for handling dark mode state.
- **React Router**: Client-side routing to navigate between different views.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **LocalStorage**: To persist dark mode preference across sessions.

## Getting Started

### Prerequisites

Before running the app, make sure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/yi-niann-nav.git
   cd yi-niann-nav
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Development Server

To run the app locally, use the following command:

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

To build the app for production:

```bash
npm run build
```

The build folder will contain the optimized production build, ready for deployment.

## Project Structure

```
├── src
│   ├── components
│   │   ├── DarkModeToggle.jsx  # Dark mode toggle button
│   ├── pages
│   │   ├── Home.jsx   # Home page with card management
│   │   ├── About.jsx  # About page
│   │   ├── Contact.jsx  # Contact page
│   ├── store
│   │   ├── darkModeSlice.js  # Redux slice for dark mode
│   │   ├── cardSlice.js  # Redux slice for card management
│   │   ├── store.js  # Redux store configuration
│   ├── App.jsx  # Main application component
│   ├── main.jsx  # Application entry point
│   ├── index.css  # Global styles
├── public
│   ├── index.html  # HTML template
├── package.json  # Dependencies and scripts
```

## Contributing

If you want to contribute to this project, feel free to fork the repository and submit a pull request. Please ensure that your contributions follow the code style and are well-documented.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Created by YiNiann.
