import ApiDocsLayout from '@/features/api-docs/Layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ApiDocsLayout>{children}</ApiDocsLayout>;
}
