"use client";

import React from 'react';
import { X, Download, MessageCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  spec: string;
  desc1?: string;
  desc2?: string;
  desc3?: string;
  desc4?: string;
  desc5?: string;
  imageUrl?: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onInquiry: () => void;
  catalogUrl?: string;
}

export default function ProductDetailModal({ isOpen, onClose, product, onInquiry, catalogUrl }: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const descriptions = [
    product.desc1,
    product.desc2,
    product.desc3,
    product.desc4,
    product.desc5
  ].filter(Boolean);

  return (
    <div className="pd-modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="pd-modal-content" 
        onClick={e => e.stopPropagation()}
      >
        <button className="pd-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="pd-modal-body">
          {/* Left: Image Section */}
          <div className="pd-image-section">
            <div className="pd-image-canvas">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="pd-no-image">NO IMAGE</div>
              )}
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="pd-info-section">
            <div className="pd-info-header">
              <h2 className="pd-product-name">{product.name}</h2>
              <div className="pd-divider" />
            </div>

            <div className="pd-description-container">
              <ul className="pd-desc-list">
                {descriptions.length > 0 ? (
                  descriptions.map((desc, idx) => (
                    <li key={idx}>
                      <span className="dot" />
                      <p>{desc}</p>
                    </li>
                  ))
                ) : (
                  <>
                    <li><span className="dot" /> <p>{product.spec || "준비 중인 구성입니다."}</p></li>
                    <li><span className="dot" /> <p>정확한 규격은 문의 부탁드립니다.</p></li>
                  </>
                )}
              </ul>
            </div>

            <div className="pd-actions">
              <button className="btn-pd-inquiry" onClick={onInquiry}>
                <MessageCircle size={18} />
                <span>제품 문의하기</span>
              </button>
              
              {catalogUrl && (
                <a href={catalogUrl} target="_blank" rel="noopener noreferrer" className="btn-pd-catalog">
                  <Download size={18} />
                  <span>카달로그 받기</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
