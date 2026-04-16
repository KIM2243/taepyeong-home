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

      <div className="grid grid-cols-1 gap-8">
        <div className="content-card max-w-xl">
          <div className="settings-section p-6 md:p-8">
            <div className="section-title-group mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">비밀번호 변경</h3>
                <p className="text-sm text-foreground/50">계정 보안을 위해 비밀번호를 주기적으로 변경하는 것을 권장합니다.</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="admin-form settings-form space-y-6">
              <div className="input-field">
                <label>현재 비밀번호</label>
                <input 
                  type="password" 
                  placeholder="현재 주 비밀번호 입력"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-field">
                  <label>새 비밀번호</label>
                  <input 
                    type="password" 
                    placeholder="새로운 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div className="input-field">
                  <label>새 비밀번호 확인</label>
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

              <div className="form-actions border-t border-border/50 pt-5 mt-2">
                <button type="submit" className="btn-submit w-full justify-center md:w-auto" disabled={isLoading}>
                  <Save size={18} />
                  <span>{isLoading ? '변경 중...' : '보안 설정 저장'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
