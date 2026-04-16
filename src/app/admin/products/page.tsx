"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, ExternalLink, GripVertical, Save } from 'lucide-react';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);   // 순서 변경됐는지 여부
  const [isSaving, setIsSaving] = useState(false);

  // 드래그 상태
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  // ── 드래그 핸들러 ──────────────────────────────────
  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndex.current = index;
  };

  const handleDrop = () => {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) return;

    const reordered = [...products];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setProducts(reordered);
    setIsDirty(true);
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  // ── 순서 저장 ──────────────────────────────────────
  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const items = products.map((p, i) => ({ id: p.id, order: i }));
      const res = await fetch('/api/admin/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error('순서 저장 실패');
      setIsDirty(false);
    } catch (err: any) {
      alert(`순서 저장 중 오류: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ── 삭제 ──────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div>
          <h1>제품 목록</h1>
          <p>등록된 모든 제품을 관리하고 수정할 수 있습니다.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {isDirty && (
            <button
              onClick={handleSaveOrder}
              disabled={isSaving}
              className="btn-save-order"
            >
              <Save size={18} />
              <span>{isSaving ? '저장 중...' : '순서 저장'}</span>
            </button>
          )}
          <Link href="/admin/products/new" className="btn-add">
            <Plus size={20} />
            <span>제품 추가</span>
          </Link>
        </div>
      </div>

      {isDirty && (
        <p style={{ fontSize: '0.8rem', color: '#2563eb', marginBottom: '0.75rem', marginTop: '-0.5rem' }}>
          ✦ 순서가 변경되었습니다. 상단 <strong>순서 저장</strong> 버튼을 눌러 확정하세요.
        </p>
      )}

      <div className="content-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '32px' }}></th>
                <th>이미지</th>
                <th>제품명</th>
                <th>카테고리</th>
                <th>규격</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  style={{ cursor: 'grab', transition: 'background 0.15s' }}
                  onDragEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#eff6ff'; }}
                  onDragLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                >
                  <td style={{ textAlign: 'center', color: '#9ca3af', paddingRight: 0 }}>
                    <GripVertical size={16} style={{ cursor: 'grab' }} />
                  </td>
                  <td>
                    <div className="table-img-box">
                      {product.imageUrl
                        ? <img src={product.imageUrl} alt={product.name} />
                        : <div className="no-img">No Img</div>
                      }
                    </div>
                  </td>
                  <td><strong>{product.name}</strong></td>
                  <td><span className="badge">{product.category.name}</span></td>
                  <td>{product.spec}</td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/products/${product.category?.slug}`} className="btn-icon" title="보기" target="_blank">
                        <ExternalLink size={18} />
                      </Link>
                      <Link href={`/admin/products/${product.id}/edit`} className="btn-icon" title="수정">
                        <Edit2 size={18} />
                      </Link>
                      <button className="btn-icon text-danger" title="삭제" onClick={() => handleDelete(product.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted">등록된 제품이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
