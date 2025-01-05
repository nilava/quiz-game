# Quiz Game

The **Quiz Game** is a real-time multiplayer quiz application where two players compete to answer a series of questions. Built with a robust backend powered by **NestJS**, **MongoDB**, and **WebSocket**, it provides an engaging and competitive experience for users.

---

## Features

- **User Authentication**: Secure JWT-based authentication for user registration and login.
- **Real-Time Gameplay**: WebSocket integration for real-time question delivery and answer validation.
- **Dynamic Question Bank**: Questions are fetched from MongoDB and randomized for each session.
- **Result Calculation**: Automatically calculates scores and announces the winner at the end of each session.
- **Scalable Design**: Kubernetes-ready for seamless deployment and scalability.
- **Dockerized**: Fully containerized with a published Docker image for quick deployment.

---

## Tech Stack

- **Backend**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Real-Time Communication**: [WebSocket](https://socket.io/)
- **Authentication**: [JWT](https://jwt.io/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Orchestration**: [Kubernetes](https://kubernetes.io/)

---

## Directory Structure

The project follows a clean and modular structure:

```plaintext
/  Main Application Structure
- src
  - app.module.ts       # Main application module
  - main.ts             # Application entry point
  - auth                # Handles user authentication
    - auth.module.ts
    - auth.controller.ts
    - auth.service.ts
    - jwt.strategy.ts
    - dto
      - login.dto.ts
      - register.dto.ts
  - game                # Manages game sessions and gameplay logic
    - game.module.ts
    - game.gateway.ts
    - game.service.ts
    - game.controller.ts
    - dto
      - start-game.dto.ts
      - submit-answer.dto.ts
  - question            # Handles quiz questions
    - question.module.ts
    - question.service.ts
    - question.schema.ts
  - users               # Manages user data
    - users.module.ts
    - users.service.ts
    - users.schema.ts
  - config              # Application configuration management
    - config.module.ts
    - config.service.ts
  - shared              # Shared modules and utilities
    - shared.module.ts
  - common
    - constants.ts      # Application-wide constants
- package.json          # Project metadata and dependencies
- tsconfig.json         # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (if using Docker)
- [Kubernetes](https://kubernetes.io/) (optional for orchestration)

---

### Local Development

1. **Clone the Repository**

   ```bash
   git clone https://github.com/nilava/quiz-game.git
   cd quiz-game
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following:

   ```plaintext
   MONGO_URI=mongodb://localhost:27017/quiz-game
   JWT_SECRET=your_jwt_secret
   ```

4. **Run MongoDB**
   Start MongoDB locally:

   ```bash
   docker run -d --name mongo -p 27017:27017 mongo:5.0
   ```

5. **Start the Server**

   ```bash
   yarn start:dev
   ```

6. **Access the Application**
   Visit:
   ```
   http://localhost:3000
   ```

---

### Using Docker

1. **Pull the Docker Image**

   ```bash
   docker pull nilava99/quiz-game:latest
   ```

2. **Run the Application**

   ```bash
   docker run -d -p 3000:3000 -e MONGO_URI="mongodb://host.docker.internal:27017/quiz-game" -e JWT_SECRET="your_jwt_secret" nilava99/quiz-game:latest
   ```

3. **Access the Application**
   Visit:
   ```
   http://localhost:3000
   ```

---

### Deploying with Kubernetes

1. **Set Up Kubernetes**
   Ensure your Kubernetes cluster is running and `kubectl` is configured.

2. **Apply the Kubernetes Configuration**
   Use the `kube.yaml` file:

   ```bash
   kubectl apply -f kube.yaml
   ```

3. **Access the Application**
   Use the `LoadBalancer` external IP or port-forward:
   ```bash
   kubectl get service
   ```

---

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Authenticate and get a JWT token.

### Game Management

- **POST /game/start**: Start a new game session.
- **WebSocket /game**: Real-time communication for game events (e.g., `question:send`, `answer:submit`).

---

## Docker Image

The latest Docker image is published on DockerHub:

- [Quiz Game Docker Image](https://hub.docker.com/r/nilava99/quiz-game)

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

### Contact

If you have any questions or feedback, feel free to reach out:

- **Author**: Nilava Chowdhury
- **GitHub**: [@nilava](https://github.com/nilava)
