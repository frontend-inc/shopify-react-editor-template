import { ComponentConfig, Slot } from '@reacteditor/core';
import { PanelsTopLeft } from 'lucide-react';

export type AppLayoutProps = {
  header: Slot;
  footer: Slot;
};

// The store's shared layout: every page renders as its children, between the
// header and footer slots.
const appLayoutEditor: ComponentConfig<AppLayoutProps> = {
  label: 'App layout',
  icon: <PanelsTopLeft size={16} />,
  // Only used as the layout, so it isn't offered in the component list.
  hidden: true,
  default: { props: { header: [], footer: [] } },
  fields: {
    header: { type: 'slot' },
    footer: { type: 'slot' },
  },
  render: ({ header: Header, footer: Footer, children }) => (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  ),
};

export default appLayoutEditor;
