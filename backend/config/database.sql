-- CMFUND Investment App Database Schema
-- PostgreSQL Database Setup

-- Create Members table
CREATE TABLE IF NOT EXISTS Members (
    id SERIAL PRIMARY KEY,
    csm_memberID VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    date_registered DATE,
    customer_number VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Investment_History table
CREATE TABLE IF NOT EXISTS Investment_History (
    id SERIAL PRIMARY KEY,
    csm_memberID VARCHAR(50) NOT NULL,
    tnx_date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    qty_bought DECIMAL(15,2) DEFAULT 0,
    purchase_price DECIMAL(15,2) DEFAULT 0,
    amount_invested DECIMAL(15,2) DEFAULT 0,
    share_balance DECIMAL(15,2) DEFAULT 0,
    current_value DECIMAL(15,2) DEFAULT 0,
    gain DECIMAL(15,2) DEFAULT 0,
    qty_sold DECIMAL(15,2) DEFAULT 0,
    charges DECIMAL(15,2) DEFAULT 0,
    shareholder VARCHAR(255),
    current_price DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (csm_memberID) REFERENCES Members(csm_memberID) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_csm_id ON Members(csm_memberID);
CREATE INDEX IF NOT EXISTS idx_members_email ON Members(email);
CREATE INDEX IF NOT EXISTS idx_investments_member_id ON Investment_History(csm_memberID);
CREATE INDEX IF NOT EXISTS idx_investments_date ON Investment_History(tnx_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for Members table
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON Members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
