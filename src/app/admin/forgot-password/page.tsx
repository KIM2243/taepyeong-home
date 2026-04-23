"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: '임시 비밀번호가 메일로 발송되었습니다. 메일함을 확인해 주세요.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || '정보를 조회하는 중 오류가 발생했습니다.' 
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '서버와 통신 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card animate-fade-in" style={{ maxWidth: '450px' }}>
        <div className="login-header">
          <div className="logo-img-box">
             <img src="/logo.png" alt="태평프레시" className="login-logo" />
          </div>
          <h1>비밀번호 찾기</h1>
          <p>등록된 아이디와 복구 이메일을 입력하시면<br/>임시 비밀번호를 발송해 드립니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field">
            <label>아이디</label>
            <div className="input-with-icon">
              <User size={18} />
              <input 
                type="text" 
                placeholder="관리자 아이디 입력" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label>복구 이메일</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="등록된 복구 이메일 주소" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {message.text && (
            <div className={`message-banner ${message.type}`} style={{ 
              marginTop: '10px', 
              padding: '12px', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {message.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <button type="submit" className="btn-login" style={{ width: 'auto', minWidth: '200px' }} disabled={isLoading || message.type === 'success'}>
              {isLoading ? '조회 중...' : '임시 비밀번호 발송'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/admin/login" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              color: '#64748b', 
              fontSize: '0.9rem', 
              textDecoration: 'none' 
            }}>
              <ArrowLeft size={16} />
              <span>로그인 페이지로 돌아가기</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
