import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // 직접 연결 (포트 5432) - 테이블 생성/마이그레이션용
    url: 'postgresql://postgres.bnorifyeoknrxzpbilbq:Rlawhddbs132!@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres',
  },
});
