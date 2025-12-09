# Meta Extensions

<div align="center">
  <img src="public/logo-new.svg" alt="Logo" width="120" height="120">
  <h3 align="center">Meta Extensions</h3>
  <p align="center">
    Is your coin the next to hit $1B? Find out with Meta Extensions.
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://meteexa.netlify.app/">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

## About The Project

**Meta Extensions** (also known as `base-fun`) is a Web3-enabled platform designed for discovering and launching new tokens. Built with the T3 Stack, it provides a seamless interface for users to:

*   **Create Coins**: Launch your own tokens easily.
*   **Discover**: View "New Pairs" and "Hot Pairs" in real-time.
*   **Trade**: Integrated swapping functionality.
*   **Connect**: Seamless wallet connection with Web3 support.

## Built With

This project is built using the [T3 Stack](https://create.t3.gg/) and modern Web3 technologies:

*   [![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
*   [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
*   [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
*   [![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
*   [![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team)
*   [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
*   **Web3**: Ethers.js, Uniswap SDK, Web3Modal.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

*   Node.js (>=20.0.0)
*   npm, yarn, or bun

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/repo_name.git
    ```
2.  Install packages
    ```sh
    yarn install
    # or
    bun install
    ```
3.  Set up your environment variables.
    Create a `.env` file in the root directory (refer to `src/env.js` for required variables):
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    # NODE_ENV="development" # Optional, defaults to development
    ```
4.  Push the database schema
    ```sh
    yarn db:push
    ```
5.  Start the development server
    ```sh
    yarn dev
    ```

## Scripts

*   `dev`: Starts the development server.
*   `build`: Builds the application for production.
*   `start`: Starts the production server.
*   `lint`: Runs linter.
*   `db:push`: Pushes schema changes to the database.
*   `db:studio`: Opens Drizzle Studio to manage the database.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.


