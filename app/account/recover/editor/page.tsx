import PageEditor from '@/components/page-editor';

// Editor for /account/recover. Sitting under the route it edits means the preview
// resolves the same params the public page gets.
export default function EditorPage() {
  return <PageEditor routeKey="/account/recover" />;
}
