"use client";

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, LayoutTemplate, MessageSquare, Info } from 'lucide-react';
import CustomEditor from '@/components/admin/CustomEditor';

export default function AdminContentSettings() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

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
          
          {/* ----- Hero Section Card ----- */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingLeft: '4px' }}>
              <LayoutTemplate color="#475569" size={20} />
              <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>메인 히어로 섹션</h3>
            </div>
            <div className="content-card p-30">
              <div className="admin-form" style={{ maxWidth: '800px' }}>
                <div className="form-group">
                  <label className="label">상단 소제목 (ACCENT)</label>
                  <input type="text" value={config.hero_accent || ''} onChange={e => handleConfigChange('hero_accent', e.target.value)} placeholder="PREMIUM FRESH LOGISTICS" className="input" />
                </div>
                <div className="form-group">
                  <label className="label">메인 타이틀 <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'lowercase' }}>(서식 적용 가능)</span></label>
                  <div style={{ background: 'white' }}>
                    <CustomEditor variant="dark" value={config.hero_title || ''} onChange={(val: string) => handleConfigChange('hero_title', val)} placeholder="자연의 신선함을 식탁까지 안전하게" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">하단 설명 내용 <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'lowercase' }}>(서식 적용 가능)</span></label>
                  <div style={{ background: 'white' }}>
                    <CustomEditor variant="dark" value={config.hero_description || ''} onChange={(val: string) => handleConfigChange('hero_description', val)} placeholder="(주)태평프레시는 최첨단 저온 물류 시스템을 통해..." />
                  </div>
                </div>
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
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '800px' }}>
                  <div className="form-group">
                    <label className="label">섹션 태그명</label>
                    <input type="text" value={config.value_tag || ''} onChange={e => handleConfigChange('value_tag', e.target.value)} placeholder="Why Taepyeong Fresh" className="input" />
                  </div>
                  <div className="form-group">
                    <label className="label">메인 제목</label>
                    <input type="text" value={config.value_title || ''} onChange={e => handleConfigChange('value_title', e.target.value)} placeholder="태평프레시를 선택하는 이유" className="input" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', marginTop: '12px' }}>
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
              <div className="admin-form" style={{ maxWidth: '800px' }}>
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
