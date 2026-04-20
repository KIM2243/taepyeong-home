"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import CustomEditor from '@/components/admin/CustomEditor';

export default function EditSlide() {
  const router = useRouter();
  const params = useParams();
  const slideId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    accent: '',
    title: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const res = await fetch(`/api/admin/slides`);
        const slides = await res.json();
        const slide = slides.find((s: any) => s.id === slideId);
        
        if (slide) {
          setFormData({
            accent: slide.accent || '',
            title: slide.title || '',
            description: slide.description || '',
            imageUrl: slide.imageUrl || ''
          });
        } else {
          alert('슬라이드를 찾을 수 없습니다.');
          router.push('/admin/content');
        }
      } catch (err) {
        console.error('Failed to fetch slide');
      } finally {
        setIsFetching(false);
      }
    };
    fetchSlide();
  }, [slideId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/slides/${slideId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('슬라이드가 성공적으로 수정되었습니다.');
        router.push('/admin/content');
        router.refresh();
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

  if (isFetching) return <div className="admin-page-container"><p>로딩 중...</p></div>;

  return (
    <div className="admin-page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/admin/content" className="btn-icon">
             <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>슬라이드 수정</h1>
            <p className="text-muted">메인 히어로 섹션의 콘텐츠를 수정하여 분위기를 새롭게 바꿉니다.</p>
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
              {isLoading ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
