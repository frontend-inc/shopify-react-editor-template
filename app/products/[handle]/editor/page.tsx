import PageEditor from "@/components/page-editor";
import page from "../page.json";

export default function EditorPage() {
  return <PageEditor page={page} routeKey="/app/products/[handle]" />;
}
