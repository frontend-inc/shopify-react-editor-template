import PageEditor from '@/components/page-editor';
import pageData from '../page.json';

// Editor for /about. Sitting under the route it edits means the preview
// resolves the same params the public page gets, and `../page.json` is the
// very file publishing writes back to.
export default function EditorPage() {
  return <PageEditor routeKey="/about" page={pageData} />;
}
