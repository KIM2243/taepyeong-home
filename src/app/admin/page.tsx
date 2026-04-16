import { redirect } from 'next/navigation';

export default function AdminPage() {
  // 기본적으로 제품 관리 페이지로 리다이렉트 시킵니다.
  redirect('/admin/products');
}
