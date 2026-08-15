import PageEditor from '@/components/page-editor';
import pageData from '../page.json';

export default function EditorPage() {
  return <PageEditor pagePath="app/about/page.json" page={pageData} />;
}
