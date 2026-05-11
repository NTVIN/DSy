# TodoApp

## Tech Stack

### Frontend
| Technology | Version |
|------------|---------|
| React | 19 |
| Vite | 6 |
| Tailwind CSS | 4 |
| Axios | 1.9 |
| React Router | 7 |

### Backend
| Technology | Version |
|------------|---------|
| Java | 24 |
| Spring Boot | 3.3.5 |
| Spring Security | 6 |
| JWT (JJWT) | 0.12.3 |
| Flyway | 10 |
| Maven | 3.9 |

### Database
| Technology | Version |
|------------|---------|
| PostgreSQL | 18 |

### Infrastructure
| Technology | Version |
|------------|---------|
| Docker | Latest |
| Docker Compose | Latest |
| Nginx | Alpine |
| Node.js | 24 |

---

## How to Start

### 1. Clone the Repository

```bash
git clone https://github.com/NTVIN/DSy.git
cd DSy
```

### 2. Start the Application

```bash
docker-compose up --build
```

### 3. Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API** | http://localhost:8080/api |
| **Health Check** | http://localhost:8080/api/health |

### 4. Test Accounts

| Email | Password |
|-------|----------|
| alice@example.com | Alice123! |
| bob@example.com | Bob123! |
| admin@example.com | Admin123! |
