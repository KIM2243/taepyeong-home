"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Calendar, MapPin, User, Phone } from 'lucide-react';

export default function AdminInquiryPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        setInquiries(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 문의 내역을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries(prev => prev.filter(item => item.id !== id));
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div>
          <h1>온라인 문의 접수 내역</h1>
          <p>웹사이트를 통해 접수된 고객 문의를 확인합니다.</p>
        </div>
      </div>

      <div className="admin-content-card">
        <div className="admin-card-body">
          {loading ? (
            <p style={{ padding: '20px', color: '#64748b' }}>불러오는 중...</p>
          ) : inquiries.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
              <Mail size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>접수된 문의 내역이 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inquiries.map(inquiry => (
                <div key={inquiry.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#64748b', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> {new Date(inquiry.createdAt).toLocaleString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14}/> {inquiry.name}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> {inquiry.phone}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> {inquiry.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ padding: '4px 10px', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>접수 완료</span>
                       <button onClick={() => handleDelete(inquiry.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
                    </div>
                  </div>
                {inquiry.address && (
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {inquiry.address}
                  </div>
                )}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', fontSize: '0.9rem', color: '#0f172a', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {inquiry.details}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
