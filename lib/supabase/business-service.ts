import { supabase, BusinessInfo } from './client'
import { BusinessInfoParams, BusinessInfoResponse } from '../tools/types'

export class SupabaseBusinessService {
  
  /**
   * Save business information to Supabase database
   */
  static async saveBusinessInfo(params: BusinessInfoParams): Promise<BusinessInfoResponse> {
    try {
      const businessData: Omit<BusinessInfo, 'id' | 'created_at' | 'updated_at'> = {
        business_name: params.business_name,
        business_address: params.business_address,
        business_phone: params.business_phone,
        business_email: params.business_email,
        business_website: params.business_website,
        business_description: params.business_description
      }

      const { data, error } = await supabase
        .from('business_info')
        .insert([businessData])
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        throw new Error(`Failed to save business info: ${error.message}`)
      }

      console.log('Business info saved to Supabase:', data)

      return {
        business_id: data.id
      }
    } catch (error) {
      console.error('Error saving business info to Supabase:', error)
      throw error
    }
  }

  /**
   * Get business information by business_id
   */
  static async getBusinessInfo(businessId: string): Promise<BusinessInfo | null> {
    try {
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .eq('business_id', businessId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null
        }
        console.error('Supabase select error:', error)
        throw new Error(`Failed to get business info: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error getting business info from Supabase:', error)
      throw error
    }
  }

  /**
   * Get all business information records
   */
  static async getAllBusinessInfo(): Promise<BusinessInfo[]> {
    try {
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase select all error:', error)
        throw new Error(`Failed to get all business info: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error getting all business info from Supabase:', error)
      throw error
    }
  }

  /**
   * Update business information
   */
  static async updateBusinessInfo(businessId: string, updates: Partial<BusinessInfoParams>): Promise<BusinessInfo> {
    try {
      const { data, error } = await supabase
        .from('business_info')
        .update(updates)
        .eq('business_id', businessId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        throw new Error(`Failed to update business info: ${error.message}`)
      }

      console.log('Business info updated in Supabase:', data)

      return data
    } catch (error) {
      console.error('Error updating business info in Supabase:', error)
      throw error
    }
  }

  /**
   * Delete business information
   */
  static async deleteBusinessInfo(businessId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_info')
        .delete()
        .eq('business_id', businessId)

      if (error) {
        console.error('Supabase delete error:', error)
        throw new Error(`Failed to delete business info: ${error.message}`)
      }

      console.log('Business info deleted from Supabase:', businessId)

      return true
    } catch (error) {
      console.error('Error deleting business info from Supabase:', error)
      throw error
    }
  }

  /**
   * Create the business_info table if it doesn't exist
   */
  static async createTable(): Promise<void> {
    try {
      // This is just a helper - in production you should create tables via Supabase dashboard or migrations
      console.log('To create the business_info table, run this SQL in your Supabase SQL editor:')
      console.log(`
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

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_business_info_business_id ON business_info(business_id);
CREATE INDEX IF NOT EXISTS idx_business_info_email ON business_info(business_email);
      `)
    } catch (error) {
      console.error('Error creating table reference:', error)
    }
  }
}