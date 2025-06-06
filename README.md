# Resume Builder Web App

A modern web application for creating professional resumes with AI assistance.

## Features

- **AI-Powered Resume Generation**: Create professional resumes using AI to organize and format your information
- **PDF Upload**: Upload existing resumes in PDF format to extract and reuse your information
- **Beautiful Templates**: Choose from multiple professionally designed resume templates
- **Real-time Preview**: See your resume changes in real-time
- **LaTeX Editing**: Advanced users can directly edit the LaTeX code
- **Interactive AI Assistance**: Get help and make revisions through an AI chat interface

## PDF Upload Feature

The application now supports extracting text from PDF resumes:

1. Click "Upload resume PDF" button in the generator page
2. Drop your PDF file or browse to select one
3. The system extracts the text content and enhances it with AI
4. Edit the extracted text if needed
5. Generate a new resume with your preferred template

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Running backend service (Resume-Builder-Backend)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Resume-Builder-WebApp.git
cd Resume-Builder-WebApp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Backend Integration

This frontend connects to the Resume-Builder-Backend API running on http://localhost:5000.
Make sure the backend is running before using the application.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
