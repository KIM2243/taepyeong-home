const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bnorifyeoknrxzpbilbq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJub3JpZnllb2tucnh6cGJpbGJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA1Njg4MiwiZXhwIjoyMDkxNjMyODgyfQ._0g5FOZHRcLnr9Y0UPwau1h-WbdGWpwhlUH_Vs8eSNI'
);

async function run() {
  // List existing buckets
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('Existing buckets:', buckets?.map(b => b.name));

  const exists = buckets?.some(b => b.name === 'uploads');
  if (!exists) {
    const { data, error } = await supabase.storage.createBucket('uploads', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
      fileSizeLimit: 10 * 1024 * 1024
    });
    if (error) {
      console.log('Error creating bucket:', error.message);
    } else {
      console.log('Bucket created successfully:', data);
    }
  } else {
    console.log('Bucket "uploads" already exists!');
  }
}

run().catch(console.error);
