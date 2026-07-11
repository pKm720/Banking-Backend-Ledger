-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,

    is_system_user BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- ACCOUNTS
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED')),

    currency VARCHAR(10) NOT NULL DEFAULT 'INR',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user
ON accounts(user_id);

CREATE INDEX IF NOT EXISTS idx_accounts_user_status
ON accounts(user_id, status);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    from_account_id UUID NOT NULL
        REFERENCES accounts(id),

    to_account_id UUID NOT NULL
        REFERENCES accounts(id),

    status VARCHAR(10) NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'COMPLETED',
                'FAILED',
                'REVERSED'
            )
        ),

    amount NUMERIC(15,2) NOT NULL
        CHECK (amount > 0),

    idempotency_key VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_from
ON transactions(from_account_id);

CREATE INDEX IF NOT EXISTS idx_transactions_to
ON transactions(to_account_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_idem
ON transactions(idempotency_key);

-- LEDGER ENTRIES (Append-only)
CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    account_id UUID NOT NULL
        REFERENCES accounts(id),

    transaction_id UUID NOT NULL
        REFERENCES transactions(id),

    amount NUMERIC(15,2) NOT NULL
        CHECK (amount > 0),

    type VARCHAR(6) NOT NULL
        CHECK (type IN ('CREDIT', 'DEBIT')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_account
ON ledger_entries(account_id);

CREATE INDEX IF NOT EXISTS idx_ledger_transaction
ON ledger_entries(transaction_id);

-- Ledger Immutability
CREATE OR REPLACE FUNCTION prevent_ledger_modification()
RETURNS TRIGGER AS
$$
BEGIN
    RAISE EXCEPTION
        'Ledger entries are immutable and cannot be modified or deleted';
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ledger_no_update
ON ledger_entries;

CREATE TRIGGER trg_ledger_no_update
BEFORE UPDATE
ON ledger_entries
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_modification();

DROP TRIGGER IF EXISTS trg_ledger_no_delete
ON ledger_entries;

CREATE TRIGGER trg_ledger_no_delete
BEFORE DELETE
ON ledger_entries
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_modification();

-- TOKEN BLACKLIST
CREATE TABLE IF NOT EXISTS token_blacklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    token TEXT NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blacklist_token
ON token_blacklist(token);