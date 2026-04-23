"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Save, AlertCircle, LayoutTemplate, MessageSquare, Info, Plus, Trash2, Edit2, ArrowUpDown, FileText, Download, Upload } from 'lucide-react';
import CustomEditor from '@/components/admin/CustomEditor';

export default function AdminContentSettings() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSlidesLoading, setIsSlidesLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConfig();
    fetchSlides();
  }, []);

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
      setIsSlidesLoading(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
      setSlides(slides.filter(s => s.id !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Failed to fetch config');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        alert('랜딩 페이지 문구가 성공적으로 저장되었습니다.');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`저장에 실패했습니다. (${res.status}: ${errorData.error || 'Server Error'})`);
      }
    } catch (err: any) {
      alert(`오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'catalog'); // Store in catalog folder

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        handleConfigChange('catalog_url', data.url);
      } else {
        alert('업로드 실패: ' + (data.error || '알 수 없는 오류'));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div>
          <h1>랜딩 문구 관리</h1>
          <p>홈페이지 메인에 표시되는 주요 섹션의 문구를 직접 수정할 수 있습니다.</p>
        </div>
        <button 
          className="btn-add" 
          onClick={handleSaveConfig} 
          disabled={isSaving || isLoading}
        >
          <Save size={20} />
          <span>{isSaving ? '저장 중...' : '변경사항 저장'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted">데이터를 불러오는 중...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* ----- Hero Section Card (Slide Management) ----- */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingLeft: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutTemplate color="#475569" size={20} />
                <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>메인 히어로 섹션 (슬라이드)</h3>
              </div>
              <Link href="/admin/slides/new" className="btn-add" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                <Plus size={16} />
                <span>{slides.length < 3 ? '슬라이드 추가' : '슬라이드(최대 3개)'}</span>
              </Link>
            </div>
            <div className="content-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>순서</th>
                      <th>이미지</th>
                      <th>소제목 (ACCENT)</th>
                      <th>메인 제목</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isSlidesLoading ? (
                      <tr><td colSpan={5} className="text-center py-20">슬라이드를 불러오는 중...</td></tr>
                    ) : slides.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-20 text-muted">
                          등록된 슬라이드가 없습니다. 우측 상단의 [슬라이드 추가] 버튼을 눌러주세요.
                        </td>
                      </tr>
                    ) : (
                      slides.map((slide, index) => (
                        <tr key={slide.id}>
                          <td style={{ textAlign: 'center' }}>{index + 1}</td>
                          <td>
                            <div className="table-img-box" style={{ width: '80px', height: '45px' }}>
                              {slide.imageUrl ? (
                                <img src={slide.imageUrl} alt={slide.title?.replace(/<[^>]*>?/gm, '')} />
                              ) : (
                                <span className="no-img">NO IMAGE</span>
                              )}
                            </div>
                          </td>
                          <td><span className="badge blue-seal">{slide.accent}</span></td>
                          <td>
                            <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                              {slide.title?.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}
                            </div>
                          </td>
                          <td>
                            <div className="table-actions">
                              <Link href={`/admin/slides/${slide.id}/edit`} className="btn-icon" title="수정">
                                <Edit2 size={18} />
                              </Link>
                              <button className="btn-icon text-danger" title="삭제" onClick={() => handleDeleteSlide(slide.id)}>
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ----- Catalog Management Section ----- */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingLeft: '4px' }}>
              <Download color="#475569" size={20} />
              <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>카달로그 파일 관리</h3>
            </div>
            
            <div className="content-card">
              <div className="p-30">
                {!config.catalog_url ? (
                  <div className="admin-form">
                    <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      현재 등록된 카달로그가 없습니다. 버튼을 활성화하려면 파일을 업로드하거나 URL 주소를 입력하세요.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ flex: 1, minWidth: '300px', marginBottom: 0 }}>
                        <label className="label">카달로그 문서 주소 (URL)</label>
                        <input 
                          type="text" 
                          placeholder="가급적 아래 업로드 버튼을 이용해 주세요"
                          value={config.catalog_url || ''} 
                          onChange={e => handleConfigChange('catalog_url', e.target.value)} 
                          className="input"
                        />
                      </div>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept=".pdf,.doc,.docx,.hwp"
                        style={{ display: 'none' }} 
                      />
                      
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()} 
                        className="btn-add" 
                        style={{ height: '42px', minWidth: '140px' }}
                        disabled={isUploading}
                      >
                        <Upload size={18} />
                        <span>{isUploading ? '업로드 중...' : '파일 업로드'}</span>
                      </button>
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>※ PDF, Word 등 문서 파일을 업로드하시면 홈페이지 하단 카달로그 버튼이 활성화됩니다.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>현재 등록된 카달로그</div>
                        <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' }}>
                          {config.catalog_url.split('/').pop() || config.catalog_url}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{config.catalog_url}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                      <a href={config.catalog_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', borderRadius: '8px' }}>
                         미리보기
                      </a>
                      <button 
                        type="button" 
                        onClick={() => { if(confirm('카달로그 연결을 해제하시겠습니까?')) handleConfigChange('catalog_url', ''); }}
                        className="btn-icon" 
                        style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', width: '40px', height: '40px', borderRadius: '8px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ----- Why Section Card ----- */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingLeft: '4px' }}>
              <MessageSquare color="#475569" size={20} />
              <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>핵심 역량 (Why) 섹션</h3>
            </div>
            <div className="content-card p-30">
              <div className="admin-form">
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div className="form-group">
                    <label className="label">섹션 태그명</label>
                    <input type="text" value={config.value_tag || ''} onChange={e => handleConfigChange('value_tag', e.target.value)} placeholder="Why Taepyeong Fresh" className="input" />
                  </div>
                  <div className="form-group">
                    <label className="label">메인 제목</label>
                    <input type="text" value={config.value_title || ''} onChange={e => handleConfigChange('value_title', e.target.value)} placeholder="태평프레시를 선택하는 이유" className="input" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
                {[1, 2, 3].map(num => (
                  <div key={num} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{num}</span>
                      카드 0{num}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label className="label" style={{ fontSize: '0.75rem' }}>카드 제목</label>
                        <input type="text" placeholder="제목을 입력하세요" value={config[`v${num}_title`] || ''} onChange={e => handleConfigChange(`v${num}_title`, e.target.value)} className="input" style={{ background: 'white' }} />
                      </div>
                      <div className="form-group">
                        <label className="label" style={{ fontSize: '0.75rem' }}>상세 설명 <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'lowercase' }}>(서식 적용 가능)</span></label>
                        <div style={{ background: 'white' }}>
                          <CustomEditor value={config[`v${num}_desc`] || ''} onChange={(val: string) => handleConfigChange(`v${num}_desc`, val)} placeholder="설명을 입력하세요" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>

          {/* ----- CTA Section Card ----- */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingLeft: '4px' }}>
              <Info color="#475569" size={20} />
              <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>하단 컨택트 (CTA) 섹션</h3>
            </div>
            <div className="content-card p-30">
              <div className="admin-form">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div className="form-group">
                    <label className="label">섹션 태그명</label>
                    <input type="text" value={config.cta_tag || ''} onChange={e => handleConfigChange('cta_tag', e.target.value)} placeholder="Contact Us" className="input" />
                  </div>
                  <div className="form-group">
                    <label className="label">메인 제목</label>
                    <input type="text" value={config.cta_title || ''} onChange={e => handleConfigChange('cta_title', e.target.value)} placeholder="신선 물류의 파트너가 되어 드리겠습니다" className="input" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">상세 설명</label>
                  <input type="text" value={config.cta_description || ''} onChange={e => handleConfigChange('cta_description', e.target.value)} placeholder="대량 주문, 납품 상담 등 비즈니스 문의를 환영합니다." className="input" />
                </div>
              </div>
            </div>
          </div>

          <div className="info-box" style={{ marginTop: '30px' }}>
             <p style={{ margin: 0 }}>💡 <strong>수정 팁</strong>: 텍스트 박스 안에서 엔터키를 눌러 원하시는 곳에 줄바꿈을 적용할 수 있습니다. 수정을 완료한 후 반드시 우측 상단의 <strong>[변경사항 저장]</strong> 버튼을 눌러주세요.</p>
          </div>

        </div>
      )}
    </div>
  );
}
