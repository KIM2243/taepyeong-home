"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [categories] = useState([
    { name: '점보롤', slug: 'jumbo-roll' },
    { name: '페이퍼타올', slug: 'paper-towel' },
    { name: '두루마리 화장지', slug: 'roll-toilet' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    spec: '',
    categorySlug: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        if (!res.ok) throw new Error('제품을 불러올 수 없습니다.');
        const product = await res.json();
        setFormData({
          name: product.name,
          spec: product.spec,
          categorySlug: product.category?.slug || '',
        });
        if (product.imageUrl) {
          setExistingImageUrl(product.imageUrl);
          setImagePreview(product.imageUrl);
        }
      } catch (err: any) {
        alert(err.message);
        router.push('/admin/products');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [productId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';
    const fd = new FormData();
    fd.append('file', imageFile);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '이미지 업로드 실패');
    }
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = existingImageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl: finalImageUrl }),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const result = await res.json();
        throw new Error(result.error || '수정 실패');
      }
    } catch (err: any) {
      console.error(err);
      alert(`수정 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="admin-page-container"><p>로딩 중...</p></div>;
  }

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="btn-back">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>제품 수정</h1>
            <p>제품 정보를 수정합니다.</p>
          </div>
        </div>
      </div>

      <div className="content-card max-w-3xl">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <label>제품 이미지</label>
            <div className="image-upload-zone">
              {imagePreview ? (
                <div className="preview-container">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setExistingImageUrl(''); }} className="btn-remove-img">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="upload-placeholder">
                  <Upload size={32} />
                  <span>클릭하여 이미지 업로드</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="input-field">
              <label>카테고리</label>
              <select
                value={formData.categorySlug}
                onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="input-field">
              <label>제품명</label>
              <input
                type="text"
                placeholder="예: 소티 점보롤"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label>규격 (Spec)</label>
            <input
              type="text"
              placeholder="예: 300m(2겹) x 16롤"
              value={formData.spec}
              onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => router.back()} className="btn-cancel">취소</button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              <Save size={18} />
              <span>{isLoading ? '저장 중...' : '수정 저장하기'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
