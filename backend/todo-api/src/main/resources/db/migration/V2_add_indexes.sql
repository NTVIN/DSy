-- Index on user_id for faster todo lookups
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- Index on email for faster user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on username for faster user lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Composite index for completed todos per user
CREATE INDEX IF NOT EXISTS idx_todos_user_completed ON todos(user_id, completed);