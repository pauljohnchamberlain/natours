# Natours

This project is about a make-believe company called Natours, which provides tour booking services.

## Getting Started

To begin working on the project, you need to follow these steps:

1. Clone the repository to your local machine by running the command:

```
git clone https://github.com/pauljohnchamberlain/natours.git
```

2. Navigate to the project directory:

```
cd natours
```

3. Install the required dependencies by running:

```
npm install
```

4. Start the server. You can choose between development mode, production mode, or the default mode. Use one of the following commands:

- Development mode:

```
npm run start:dev
```

- Production mode:

```
npm run start:prod
```

- Default mode:

```
npm start
```

The server will start and run on `http://localhost:3000`. You can access the API at `http://localhost:3000/api/v1`.

To test the project, you can use some pre-defined test user emails like "sophie10@example.com" or "loulou@example.com" with the password "test1234". Alternatively, you can create a new user.

## Features and Functionality

The Natours project includes the following features:

- Ability to perform Create, Read, Update, and Delete (CRUD) operations on tours, reviews, users, and bookings. The operations support advanced features like filtering, sorting, pagination, and field limiting.
- Calculation of tour statistics using aggregate functions.
- Geospatial querying to find tours within a certain radius of a given location.
- User authentication and authorization using JSON Web Tokens (JWT).
- Password encryption using the bcrypt library.
- Password reset functionality using JWT tokens.
- Management of user roles and permissions.
- Handling of forgetting and resetting user passwords.
- Two special routes for updating the current user's data or password.
- Sending real emails for new sign-ups and password resets using the SendGrid API and the Mailtrap service.
- Ability to get all reviews and create new reviews for a specific tour (nested routes).
- Ability to make new bookings using Stripe checkout sessions for payment processing.
- Usage of Stripe webhooks to handle asynchronous payment events, update booking statuses, and protect against fraud.
- Robust error and exception handling using global error middleware and error controller in both development and production environments.
- Handling of errors in asynchronous functions using the catchAsync utility function.
- Handling of all unhandled rejections and uncaught exceptions.
- Image upload and processing using the Cloudinary API, Multer, and the Sharp package.
- Implementation of advanced security measures like rate limiting and data sanitization to prevent security vulnerabilities.
- Integration with the Mapbox API to display tour locations on a map.
- Use of the Model-View-Controller (MVC) architecture pattern to organize the project's code.
- Use of the Pug template engine to render HTML templates on the server.
- Use of the Parcel bundler to bundle the project's JavaScript files.
- Use of the ESLint linter to maintain a consistent code style.
- Use of the Prettier code formatter to maintain a consistent code style.
- Deployment of the project to the Cyclic hosting platform.
- Enablement of CORS (Cross-Origin Resource Sharing) to allow requests from other domains.
- API documentation using Postman. You can access it at the following link: [Postman API Documentation](https://web.postman.co/workspace/My-Workspace~0bcab44a-ec2c-465b-8616-4525188fbc69/documentation/18406472-8fb758cf-0036-4233-9dfe-1cef
