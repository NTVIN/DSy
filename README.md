# 🚀 Load-Balanced Microservices with JWT Auth

A containerized full-stack application featuring JWT authentication, load balancing with failover, and persistent storage.

---

## 🛠️ Tools & Technologies

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite) |
| **Backend** | Spring Boot (Java) |
| **Database** | PostgreSQL 17 |
| **Load Balancer** | Nginx / Traefik |
| **Containerization** | Docker & Docker Compose |
| **Authentication** | JWT (OWASP-compliant) |
| **Load Testing** | `wrk` / `hey` / `ab` |

---

## 📁 Project Structure

```
project/
├── docker-compose.yml        # Orchestrates all services
├── .env                      # Environment variables (secrets)
├── frontend/                 # React app
│   └── Dockerfile
├── backend/                  # Spring Boot service (2 instances)
│   └── Dockerfile
├── nginx/                    # Load balancer config
│   └── nginx.conf
└── db/
    └── init.sql              # Database seed/migration
```

---

## ⚙️ Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 
- [Docker Compose](https://docs.docker.com/compose/) 

No other local dependencies required.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Configure secrets

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DB_NAME=authdb
DB_USER=postgres
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

### 3. Start the entire system

```bash
docker compose up --build
```

This single command will:
- Build the React frontend and Spring Boot backend images
- Start two backend instances (`backend-1`, `backend-2`)
- Start the Nginx load balancer (round-robin across both instances)
- Start PostgreSQL with automatic schema migration/seeding
- Wire everything together on a shared Docker network

### 4. Access the application

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API (via load balancer) | http://localhost:8080/api |
| Backend instance 1 (direct) | http://localhost:8081 |
| Backend instance 2 (direct) | http://localhost:8082 |

---

## 🔐 Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT
- All other `/api/**` endpoints require `Authorization: Bearer <token>`

JWT tokens expire after 1 hour. Refresh by re-authenticating.

---

## 🧪 Load Testing

With the system running, test a protected endpoint:

```bash
# Using hey
hey -n 1000 -c 50 -H "Authorization: Bearer <your_token>" http://localhost:8080/api/todos

# Using wrk
wrk -t4 -c50 -d30s -H "Authorization: Bearer <your_token>" http://localhost:8080/api/todos

# Using Apache Bench
ab -n 1000 -c 50 -H "Authorization: Bearer <your_token>" http://localhost:8080/api/todos
```

---

## 🔥 Failover Demo

To demonstrate failover, stop one backend instance while the system is running:

```bash
docker compose stop backend-1
```

Traffic is automatically routed to `backend-2`. Restart to restore:

```bash
docker compose start backend-1
```

---

## 🛑 Stopping the System

```bash
docker compose down          # Stop containers
docker compose down -v       # Stop and remove volumes (wipes DB)
```
