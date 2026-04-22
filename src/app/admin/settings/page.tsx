"use client";

import React, { useState, useEffect } from 'react';
import { Save, Lock, ShieldCheck, AlertCircle, Mail, Plus, X } from 'lucide-react';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Email Notification Settings State
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });

  // Fetch settings on mount
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.notification_emails) {
          try {
            const parsedEmails = JSON.parse(data.notification_emails);
            if (Array.isArray(parsedEmails)) {
              setEmails(parsedEmails);
            }
          } catch (e) {
            console.error('Failed to parse notification emails');
          }
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

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

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    
    // Basic email validation regex
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
      setEmailMessage({ type: 'error', text: '유효한 이메일 주소를 입력해주세요.' });
      return;
    }

    if (emails.includes(newEmail)) {
      setEmailMessage({ type: 'error', text: '이미 등록된 이메일입니다.' });
      return;
    }

    setEmails([...emails, newEmail]);
    setNewEmail('');
    setEmailMessage({ type: '', text: '' });
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
    setEmailMessage({ type: '', text: '' });
  };

  const handleSaveEmailSettings = async () => {
    setIsEmailLoading(true);
    setEmailMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notification_emails: JSON.stringify(emails)
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEmailMessage({ type: 'success', text: '이메일 설정이 완료되었습니다.' });
      } else {
        setEmailMessage({ type: 'error', text: data.message || '저장에 실패했습니다.' });
      }
    } catch (err) {
      setEmailMessage({ type: 'error', text: '처리 중 오류가 발생했습니다.' });
    } finally {
      setIsEmailLoading(false);
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

      {/* --- Email Notification Settings Section --- */}
      <div className="max-w-3xl" style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingLeft: '4px' }}>
          <Mail color="#475569" size={20} />
          <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>이메일 알림 설정</h3>
        </div>
        
        <div className="content-card p-30">
          <div className="admin-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                홈페이지에서 온라인 문의 및 상담 신청이 들어왔을 때 알림을 받을 사내 이메일 주소를 등록하세요.
              </p>
              
              {/* Adding Email Input */}
              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label className="label">이메일 추가</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="email" 
                    placeholder="수신할 이메일 주소 입력"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                    className="input"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={handleAddEmail} className="btn-secondary" style={{ padding: '0 16px', borderRadius: '8px' }}>
                    <Plus size={18} />
                    <span>추가</span>
                  </button>
                </div>
              </div>

              {/* Tag List */}
              {emails.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {emails.map((email, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '30px', fontSize: '0.85rem', color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <span>{email}</span>
                      <button type="button" onClick={() => handleRemoveEmail(email)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: '#94a3b8', borderRadius: '50%' }} aria-label="삭제">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {emails.length === 0 && (
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  아직 등록된 수신 이메일이 없습니다.
                </div>
              )}

              {/* Messages */}
              {emailMessage.text && (
                <div className={`message-banner ${emailMessage.type}`} style={{ marginTop: '0' }}>
                  {emailMessage.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  <span>{emailMessage.text}</span>
                </div>
              )}

              {/* Actions */}
              <div className="form-actions" style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <button type="button" onClick={handleSaveEmailSettings} className="btn-primary" disabled={isEmailLoading} style={{ minWidth: '160px' }}>
                  <Save size={18} />
                  <span>{isEmailLoading ? '저장 중...' : '알림 설정 저장'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
