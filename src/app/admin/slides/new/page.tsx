"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import CustomEditor from '@/components/admin/CustomEditor';

export default function NewSlide() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accent: '',
    title: '',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('슬라이드가 성공적으로 등록되었습니다.');
        router.push('/admin/content');
      } else {
        const error = await res.json();
        alert(error.error || '저장 실패');
      }
    } catch (err) {
      alert('오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/admin/content" className="btn-icon">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>새 슬라이드 등록</h1>
            <p className="text-muted">메인 화면의 히어로 섹션에 활기를 불어넣을 새로운 콘텐츠를 만듭니다.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="content-card p-30">
          <div className="form-group mb-20">
            <label className="label">소제목 (Accent Color)</label>
            <input 
              type="text" 
              className="input" 
              placeholder="예: Premium Fresh Logistics" 
              value={formData.accent}
              onChange={(e) => setFormData({...formData, accent: e.target.value})}
              required
            />
          </div>

          <div className="form-group mb-20">
            <label className="label">메인 제목</label>
            <div className="hero-editor-container">
              <CustomEditor 
                variant="dark"
                value={formData.title}
                onChange={(val) => setFormData({...formData, title: val})}
                placeholder="제목을 입력하세요."
              />
            </div>
            <p className="text-muted mt-5" style={{ fontSize: '0.8rem' }}>💡 위 박스 너비(800px)는 실제 사이트의 텍스트 영역과 동일하여 줄바꿈 위치를 미리 확인할 수 있습니다.</p>
          </div>

          <div className="form-group mb-20">
            <label className="label">하단 설명문</label>
            <textarea 
              className="input" 
              style={{ minHeight: '100px', padding: '12px', lineHeight: '1.6' }}
              placeholder="상세 설명을 입력하세요. 엔터(Enter)를 입력하여 줄바꿈을 적용할 수 있습니다." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="form-group mb-30">
            <label className="label">배경 이미지 URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="https://... (입력하지 않으면 기본 배경색이 적용됩니다)" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => window.open('/admin/storage', '_blank')}
                style={{ whiteSpace: 'nowrap', flexShrink: 0, height: '44px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ImageIcon size={18} />
                <span>이미지함</span>
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              <Save size={18} />
              {isLoading ? '저장 중...' : '슬라이드 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
