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
          router.push('/admin/slides');
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
        router.push('/admin/slides');
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
      <div className="page-header">
        <div className="flex items-center gap-10">
          <Link href="/admin/slides" className="btn-icon">
             <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>슬라이드 수정</h1>
            <p>메인 화면의 히어로 섹션 콘텐츠를 수정합니다.</p>
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
            <div style={{ background: 'white' }}>
              <CustomEditor 
                variant="dark"
                value={formData.title}
                onChange={(val) => setFormData({...formData, title: val})}
                placeholder="제목을 입력하세요."
              />
            </div>
          </div>

          <div className="form-group mb-20">
            <label className="label">하단 설명문</label>
            <input 
              type="text" 
              className="input" 
              placeholder="간략한 설명을 입력하세요." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="form-group mb-30">
            <label className="label">배경 이미지 URL</label>
            <div className="flex gap-10">
              <input 
                type="text" 
                className="input" 
                placeholder="https://..." 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                required
              />
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
