"use client";

import React, { useState } from 'react';
import { Save, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: 'admin', 
          currentPassword, 
          newPassword 
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '처리 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div>
          <h1>환경 설정</h1>
          <p>관리자 계정 보안 및 시스템 기본 설정을 관리합니다.</p>
        </div>
      </div>

      <div className="max-w-3xl" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingLeft: '4px' }}>
          <Lock color="#475569" size={20} />
          <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>비밀번호 변경</h3>
        </div>
        
        <div className="content-card p-30">
          <form onSubmit={handleChangePassword} className="admin-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
              
              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label className="label">현재 비밀번호</label>
                <input 
                  type="password" 
                  placeholder="현재 주 비밀번호 입력"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="form-group">
                  <label className="label">새 비밀번호</label>
                  <input 
                    type="password" 
                    placeholder="새로운 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">새 비밀번호 확인</label>
                  <input 
                    type="password" 
                    placeholder="비밀번호 재입력"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              {message.text && (
                <div className={`message-banner ${message.type}`}>
                  {message.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="form-actions" style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <button type="submit" className="btn-primary" disabled={isLoading} style={{ minWidth: '160px' }}>
                  <Save size={18} />
                  <span>{isLoading ? '변경 중...' : '보안 설정 저장'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
