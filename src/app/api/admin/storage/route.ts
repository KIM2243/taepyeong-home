import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    // Ensure directory exists
    try {
      await stat(uploadDir);
    } catch {
      return NextResponse.json([]); // Return empty if dir doesn't exist yet
    }

    const files = await readdir(uploadDir);
    
    // Sort by modified time (newest first)
    const fileList = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadDir, file);
        const stats = await stat(filePath);
        return {
          name: file,
          url: `/uploads/products/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
          mtime: stats.mtime
        };
      })
    );

    const sortedFiles = fileList.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    return NextResponse.json(sortedFiles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
