-- Create business_info table for storing business partnership information
CREATE TABLE IF NOT EXISTS business_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id VARCHAR(255) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_address TEXT NOT NULL,
  business_phone VARCHAR(50) NOT NULL,
  business_email VARCHAR(255) NOT NULL,
  business_website VARCHAR(255) NOT NULL,
  business_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_info_business_id ON business_info(business_id);
CREATE INDEX IF NOT EXISTS idx_business_info_email ON business_info(business_email);
CREATE INDEX IF NOT EXISTS idx_business_info_created_at ON business_info(created_at);

-- Add RLS (Row Level Security) policies if needed
-- Uncomment the following lines if you want to enable RLS
-- ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for service role
-- CREATE POLICY "Allow full access for service role" ON business_info FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_business_info_updated_at
    BEFORE UPDATE ON business_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();