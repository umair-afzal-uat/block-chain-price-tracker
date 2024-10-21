# Block Chain Price Tracker

## Overview

The Block Chain Price Tracker is a NestJS application that allows users to track cryptocurrency prices in real-time. This project utilizes various technologies to provide a robust and efficient solution for monitoring blockchain prices.

## Features

- Real-time tracking of cryptocurrency prices
- Email notifications using Mailgun
- Data storage using PostgreSQL

## Technologies Used

- **Backend Framework:** NestJS
- **Database:** PostgreSQL
- **Email Service:** Mailgun
- **Blockchain Integration:** Moralis

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14 or later)
- PostgreSQL
- npm (Node Package Manager)

### Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
MORALIS_API_KEY=
```

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/umair-afzal-uat/blockchain-price-tracker.git
   cd block-chain-price-tracker
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Start the application:

   For development:
   ```bash
   npm run start:dev
   ```

   For production:
   ```bash
   npm run start:prod
   ```

## Scripts

| Command            | Description                               |
|--------------------|-------------------------------------------|
| `npm run build`    | Compiles the TypeScript code             |
| `npm run start`    | Starts the application in development mode|
| `npm run start:prod`| Starts the application in production mode|
| `npm run lint`     | Lints the code using ESLint              |
| `npm run test`     | Runs unit tests                          |
| `npm run test:cov` | Runs tests and collects coverage         |

## Running Tests

To run tests, use:

```bash
npm run test
```

To watch for changes and re-run tests:

```bash
npm run test:watch
```

## License

This project is licensed under the [MIT](LICENSE) license.

## Author

Umair Afzal
```

Feel free to modify any sections as needed, especially the overview, features, and author information!