"use client";

import React, { useState, useEffect } from 'react';
import { Upload, Copy, Check, Trash2, ArrowLeft, Image as ImageIcon, Search, FileText } from 'lucide-react';
import Link from 'next/link';

interface FileData {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function StoragePage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/admin/storage');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFiles(data);
      }
    } catch (err) {
      console.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        fetchFiles();
      } else {
        alert('업로드 실패');
      }
    } catch (err) {
      alert('오류 발생');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/admin/content" className="btn-icon">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>이미지 관리 (스토리지)</h1>
            <p className="text-muted">서버에 저장된 모든 이미지와 파일을 관리합니다.</p>
          </div>
        </div>
        
        <label className="btn-add" style={{ cursor: 'pointer' }}>
          <Upload size={18} />
          <span>{uploading ? '업로드 중...' : '이미지 업로드'}</span>
          <input type="file" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} accept="image/*" />
        </label>
      </div>

      <div className="content-card p-30">
        <div className="storage-toolbar" style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="파일명 검색..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input" 
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-40 text-center text-muted">불러오는 중...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-40 text-center text-muted">
            {searchQuery ? '검색 결과가 없습니다.' : '저장된 이미지가 없습니다.'}
          </div>
        ) : (
          <div className="storage-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredFiles.map((file) => (
              <div key={file.url} className="file-card" style={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px', 
                overflow: 'hidden',
                background: 'white',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ 
                  height: '140px', 
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as any).src = "https://via.placeholder.com/200?text=No+Image";
                    }}
                  />
                  <div className="file-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    padding: '0 10px'
                  }}>
                    <button 
                      onClick={() => copyToClipboard(file.url)}
                      className="btn-submit"
                      style={{ fontSize: '0.75rem', padding: '8px 12px' }}
                    >
                      {copiedUrl === file.url ? <Check size={14} /> : <Copy size={14} />}
                      주소 복사
                    </button>
                  </div>
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    marginBottom: '4px'
                  }} title={file.name}>
                    {file.name}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatSize(file.size)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .file-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        .file-card:hover .file-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
