import { NextResponse } from 'next/server';
import { writeFile, mkdir, stat } from 'fs/promises';
import path from 'path';

async function fileExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function getAvailableFileName(dirPath: string, originalName: string) {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  
  // Basic sanitization
  const sanitizedBase = baseName.replace(/[\s\W]+/g, '_').replace(/^_+|_+$/g, '');
  const cleanName = sanitizedBase || 'upload';
  
  let fileName = `${cleanName}${ext}`;
  let filePath = path.join(dirPath, fileName);
  let counter = 1;

  while (await fileExists(filePath)) {
    fileName = `${cleanName}(${counter})${ext}`;
    filePath = path.join(dirPath, fileName);
    counter++;
  }

  return fileName;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products'; // Default to products
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    // Generate smart filename
    const fileName = await getAvailableFileName(uploadDir, file.name);
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Return the public URL path
    const publicUrl = `/uploads/${folder}/${fileName}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
