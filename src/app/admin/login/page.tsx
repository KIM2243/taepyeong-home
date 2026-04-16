"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Leaf } from 'lucide-react';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load remembered ID on mount
  useEffect(() => {
    const savedId = localStorage.getItem('remembered_admin_id');
    if (savedId) {
      setId(savedId);
      setRememberId(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Save ID if remember is checked
        if (rememberId) {
          localStorage.setItem('remembered_admin_id', id);
        } else {
          localStorage.removeItem('remembered_admin_id');
        }
        router.push('/admin/products');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="logo-img-box">
             <img src="/logo.png" alt="태평프레시" className="login-logo" />
          </div>
          <h1>태평프레시 관리자</h1>
          <p>정보를 입력하여 관리자 대시보드에 접속하세요.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-field">
            <label>아이디</label>
            <div className="input-with-icon">
              <User size={18} />
              <input 
                type="text" 
                placeholder="Admin ID" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label>비밀번호</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />
              <span>아이디 저장</span>
            </label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
