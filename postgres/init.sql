-- Create tokens table
CREATE TABLE "blacklist" (
    "token" VARCHAR(4096) NOT NULL,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("token")
);

-- Create users table
CREATE TABLE "users" (
    "user_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");