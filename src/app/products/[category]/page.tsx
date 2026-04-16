import { prisma } from '@/lib/prisma';
import { Leaf, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category: slug } = params;

  // Fetch category info and products
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!category) {
    return <div className="container py-20 text-center">카테고리를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="layout-wrapper">
      {/* Simple Category Header */}
      <section className="category-hero">
        <div className="container">
          <p className="category-tag">Premium Fresh Selection</p>
          <h1 className="category-title">{category.name}</h1>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="product-grid-section">
        <div className="container">
          <div className="product-grid">
            {category.products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-img-box">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="img-placeholder">Image Coming Soon</div>
                  )}
                  {/* Eco Label (Updated to match Blue branding) */}
                  <div className="eco-label blue-seal">
                    <ShieldCheck size={14} />
                    <span>정품보증</span>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-spec">{product.spec}</p>
                </div>
              </div>
            ))}
          </div>

          {category.products.length === 0 && (
            <div className="empty-state">
              <p>등록된 제품이 없습니다. 관리자에서 제품을 등록해 주세요.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="container">
          <div className="cta-box">
            <h4>구매 및 대량 주문 문의</h4>
            <p>태평프레시의 신선함을 사업장에서도 만나보세요.</p>
            <Link href="/contact" className="btn-cta">
              상담 신청하기 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
