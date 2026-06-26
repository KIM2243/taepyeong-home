const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bnorifyeoknrxzpbilbq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJub3JpZnllb2tucnh6cGJpbGJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA1Njg4MiwiZXhwIjoyMDkxNjMyODgyfQ._0g5FOZHRcLnr9Y0UPwau1h-WbdGWpwhlUH_Vs8eSNI'
);

async function run() {
  // Check bucket details
  const { data: bucket, error: bucketErr } = await supabase.storage.getBucket('uploads');
  console.log('Bucket info:', JSON.stringify(bucket, null, 2));
  if (bucketErr) console.log('Bucket error:', bucketErr.message);

  // List files in uploads/products
  const { data: files, error: filesErr } = await supabase.storage.from('uploads').list('products');
  console.log('\nFiles in uploads/products:');
  if (files && files.length > 0) {
    files.forEach(f => {
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(`products/${f.name}`);
      console.log(`  - ${f.name} => ${urlData.publicUrl}`);
    });
  } else {
    console.log('  (no files)');
  }
  if (filesErr) console.log('Files error:', filesErr.message);
}

run().catch(console.error);
