import PageEditor from '@/components/page-editor';

// Editor for /about. Sitting under the route it edits means the preview
// resolves the same params the public page gets.
export default function EditorPage() {
  return <PageEditor routeKey="/about" />;
}
