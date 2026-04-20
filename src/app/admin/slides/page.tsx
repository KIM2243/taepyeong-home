"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, Layout, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function SlideManagement() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/slides');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSlides(data);
      }
    } catch (err) {
      console.error('Failed to fetch slides');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
      setSlides(slides.filter(s => s.id !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div>
          <h1>메인 슬라이드 관리</h1>
          <p>홈페이지 메인 히어로 섹션에 표시될 슬라이드(최대 4개)를 관리합니다.</p>
        </div>
        {slides.length < 4 && (
          <Link href="/admin/slides/new" className="btn-add">
            <Plus size={20} />
            <span>슬라이드 추가</span>
          </Link>
        )}
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>순서</th>
                <th>이미지</th>
                <th>소제목 (Accent)</th>
                <th>메인 제목</th>
                <th>설명</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide, index) => (
                <tr key={slide.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="table-img-box">
                      {slide.imageUrl ? (
                        <img src={slide.imageUrl} alt={slide.title?.replace(/<[^>]*>?/gm, '')} />
                      ) : (
                        <span className="no-img">NO IMAGE</span>
                      )}
                    </div>
                  </td>
                  <td><span className="badge blue-seal">{slide.accent}</span></td>
                  <td><strong dangerouslySetInnerHTML={{ __html: slide.title }} /></td>
                  <td className="text-muted">{slide.description}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/slides/${slide.id}/edit`} className="btn-icon" title="수정">
                        <Edit2 size={18} />
                      </Link>
                      <button className="btn-icon" title="순서변경"><ArrowUpDown size={18} /></button>
                      <button className="btn-icon text-danger" title="삭제" onClick={() => handleDelete(slide.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && slides.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-muted">
                    등록된 슬라이드가 없습니다. 우측 상단의 [슬라이드 추가] 버튼을 눌러주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="info-box mt-20">
         <p>💡 <strong>디자인 팁</strong>: 레퍼런스 스타일을 위해 가로가 긴 고화질 이미지를 권장하며, 가급적 4개를 모두 채우는 것이 시각적으로 가장 풍성합니다.</p>
      </div>
    </div>
  );
}
