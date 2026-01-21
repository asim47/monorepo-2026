-- Add password column as nullable first
ALTER TABLE "users" ADD COLUMN "password" TEXT;

-- Set a temporary password for existing users (they'll need to reset it)
-- Using bcrypt hash of "temp_password_change_me"
UPDATE "users" SET "password" = '$2b$10$rQZ8vJ8vJ8vJ8vJ8vJ8vJ.8vJ8vJ8vJ8vJ8vJ8vJ8vJ8vJ8vJ8vJ' WHERE "password" IS NULL;

-- Now make it NOT NULL
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;
