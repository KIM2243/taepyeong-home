"use client";

import React, { useState, useEffect } from 'react';
import { Save, Lock, ShieldCheck, AlertCircle, Mail, Plus, X, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [lastSavedRecoveryEmail, setLastSavedRecoveryEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [recoveryMessage, setRecoveryMessage] = useState({ type: '', text: '' });

  // Email validation helper
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Email Notification Settings State
  const [emails, setEmails] = useState<string[]>([]);
  const [lastSavedEmails, setLastSavedEmails] = useState<string>('[]');
  const [newEmail, setNewEmail] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });

  // Fetch settings on mount
  useEffect(() => {
    // Fetch Site Settings (Notification Emails)
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.notification_emails) {
          try {
            const parsedEmails = JSON.parse(data.notification_emails);
            if (Array.isArray(parsedEmails)) {
              setEmails(parsedEmails);
              setLastSavedEmails(JSON.stringify(parsedEmails));
            }
          } catch (e) {
            console.error('Failed to parse notification emails');
          }
        }
      })
      .catch(err => console.error('Error fetching settings:', err));

    // Fetch Admin Profile (Recovery Email)
    fetch('/api/admin/profile')
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          setRecoveryEmail(data.email);
          setLastSavedRecoveryEmail(data.email);
        }
      })
      .catch(err => console.error('Error fetching admin profile:', err));
  }, []);
  
  // Auto-hide messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  useEffect(() => {
    if (recoveryMessage.text) {
      const timer = setTimeout(() => {
        setRecoveryMessage({ type: '', text: '' });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [recoveryMessage.text]);

  useEffect(() => {
    if (emailMessage.text) {
      const timer = setTimeout(() => {
        setEmailMessage({ type: '', text: '' });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [emailMessage.text]);

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
    
    // Use shared validation helper
    if (!validateEmail(newEmail)) {
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
        setLastSavedEmails(JSON.stringify(emails));
      } else {
        setEmailMessage({ type: 'error', text: data.message || '저장 실패' });
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

      <div style={{ marginTop: '20px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingLeft: '4px' }}>
          <Lock color="#475569" size={20} />
          <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>비밀번호 변경</h3>
        </div>
        
        <div className="content-card p-30">
          <form onSubmit={handleChangePassword} className="admin-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              
              <div className="form-group" style={{ maxWidth: 'calc(50% - 12px)' }}>
                <label className="label">현재 비밀번호</label>
                <input 
                  type="password" 
                  placeholder="현재 비밀번호 입력"
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
                    placeholder="새 비밀번호 입력"
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
                    placeholder="새 비밀번호 재입력"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              
              {message.text && (
                <div className={`message-banner ${message.type} animate-hide`}>
                  {message.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="form-actions" style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-primary" disabled={isLoading} style={{ minWidth: '160px' }}>
                  <Save size={18} />
                  <span>{isLoading ? '변경 중...' : '비밀번호 변경 저장'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div style={{ marginTop: '40px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingLeft: '4px' }}>
          <ShieldCheck color="#475569" size={20} />
          <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>계정 복구 설정</h3>
        </div>
        
        <div className="content-card p-30">
          <div className="admin-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              <div className="form-group">
                <label className="label">계정 복구용 이메일</label>
                
                {recoveryEmail && recoveryEmail === lastSavedRecoveryEmail ? (
                  /* Applied State: Pill/Chip Style (Image 2 inspired) */
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '12px 20px', 
                    background: '#f0fdf4', 
                    border: '1px solid #10b981', 
                    borderRadius: '50px', 
                    width: 'fit-content',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.05)',
                    transition: 'all 0.2s ease'
                  }}>
                    <CheckCircle size={20} color="#10b981" />
                    <span style={{ 
                      fontSize: '1rem', 
                      color: '#065f46', 
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}>
                      {recoveryEmail}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setLastSavedRecoveryEmail('')}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: '4px', 
                        cursor: 'pointer', 
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '50%',
                        marginLeft: '4px'
                      }}
                      title="수정하기"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  /* Editing State: Standard Input */
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="email" 
                      placeholder="비밀번호 분실 시 임시 비밀번호를 받을 이메일 주소"
                      value={recoveryEmail}
                      onChange={(e) => {
                        setRecoveryEmail(e.target.value);
                        if (recoveryMessage.text) setRecoveryMessage({ type: '', text: '' });
                      }}
                      className="input"
                      style={{ flex: 1, paddingRight: '40px' }}
                    />
                    {validateEmail(recoveryEmail) && (
                      <CheckCircle size={18} color="#10b981" style={{ position: 'absolute', right: '12px' }} />
                    )}
                  </div>
                )}

                {recoveryEmail && !validateEmail(recoveryEmail) && (
                  <p style={{ fontSize: '0.82rem', color: '#ef4444', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                    <AlertCircle size={14} />
                    올바른 이메일 형식을 입력해 주세요. (예: example@domain.com)
                  </p>
                )}

                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '12px' }}>
                  ※ 실제 비밀번호 분실 시 이 주소로 복구 메일이 발송되므로 정확히 입력해 주세요.
                </p>
                <p style={{ fontSize: '0.82rem', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
                  ※ 보안을 위해 홈페이지 등에 공개되지 않은 관리자 전용 이메일 주소 사용을 강력히 권장합니다.
                </p>

                {recoveryMessage.text && (
                  <div className={`message-banner ${recoveryMessage.type} animate-hide`} style={{ marginTop: '16px' }}>
                    {recoveryMessage.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                    <span>{recoveryMessage.text}</span>
                  </div>
                )}
              </div>

              <div className="form-actions" style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={async () => {
                  if (!validateEmail(recoveryEmail)) {
                    setRecoveryMessage({ type: 'error', text: '이메일 형식이 올바르지 않습니다. 형식을 확인해 주세요.' });
                    return;
                  }

                    setIsLoading(true);
                    try {
                      const res = await fetch('/api/admin/profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: recoveryEmail }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setRecoveryMessage({ type: 'success', text: '복구용 이메일이 저장되었습니다.' });
                        setLastSavedRecoveryEmail(recoveryEmail);
                      } else {
                        setRecoveryMessage({ type: 'error', text: data.error || data.message || '저장 실패' });
                      }
                    } catch (err) {
                      setRecoveryMessage({ type: 'error', text: '오류 발생' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="btn-primary" 
                  disabled={isLoading || !recoveryEmail || recoveryEmail === lastSavedRecoveryEmail}
                  style={{ minWidth: '180px' }}
                >
                  <Save size={18} />
                  <span>{isLoading ? '저장 중...' : '복구 이메일 저장'}</span>
                </button>
              </div>
              </div>

            </div>
          </div>
        </div>

      {/* --- Email Notification Settings Section --- */}
      <div style={{ marginTop: '40px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingLeft: '4px' }}>
          <Mail color="#475569" size={20} />
          <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.15rem', margin: 0 }}>이메일 알림 설정</h3>
        </div>
        
        <div className="content-card p-30">
          <div className="admin-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                홈페이지에서 온라인 문의 및 상담 신청이 들어왔을 때 알림을 받을 사내 이메일 주소를 등록하세요.
              </p>
              
              {/* Adding Email Input */}
              <div className="form-group" style={{ maxWidth: '600px' }}>
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
                <div className={`message-banner ${emailMessage.type} animate-hide`} style={{ marginTop: '0' }}>
                  {emailMessage.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  <span>{emailMessage.text}</span>
                </div>
              )}

              {/* Actions */}
              <div className="form-actions" style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button type="button" onClick={handleSaveEmailSettings} className="btn-primary" disabled={isEmailLoading || JSON.stringify(emails) === lastSavedEmails} style={{ minWidth: '160px' }}>
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
