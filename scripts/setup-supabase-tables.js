require('dotenv').config();
const { SupabaseBusinessService } = require('../lib/supabase/business-service');

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database tables...');
  
  try {
    // Show the SQL command to create the table
    await SupabaseBusinessService.createTable();
    
    console.log('\n✅ Database setup instructions displayed above.');
    console.log('💡 Please run the SQL commands in your Supabase SQL editor to create the tables.');
    console.log(`🔗 Go to: https://supabase.com/dashboard/project/fmamddwjkqjmdoemzfyf/sql`);
    
  } catch (error) {
    console.error('❌ Error during database setup:', error);
  }
}

setupDatabase();