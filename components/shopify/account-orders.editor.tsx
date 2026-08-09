import { ComponentConfig } from '@reacteditor/core';
import { Receipt } from 'lucide-react';
import AccountOrders, {
  type AccountOrdersProps,
} from '@/components/shopify/account-orders';

const accountOrdersEditor: ComponentConfig<AccountOrdersProps> = {
  label: 'Order history',
  icon: <Receipt size={16} />,
  category: 'account',
  defaultProps: {
    title: 'Order history',
    signedOutMessage: 'Sign in to see your orders.',
    emptyMessage: "You haven't placed any orders yet.",
    limit: 20,
  },
  fields: {
    title: { label: 'Title', type: 'text', contentEditable: true },
    signedOutMessage: {
      label: 'Signed-out message',
      type: 'text',
      contentEditable: true,
    },
    emptyMessage: {
      label: 'Empty message',
      type: 'text',
      contentEditable: true,
    },
    limit: { label: 'Orders shown', type: 'number', min: 1, max: 50 },
  },
  render: (props) => <AccountOrders {...props} />,
};

export default accountOrdersEditor;
