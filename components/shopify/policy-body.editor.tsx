import { ComponentConfig } from '@reacteditor/core';
import { FileText } from 'lucide-react';
import PolicyBody, {
  type PolicyBodyProps,
} from '@/components/shopify/policy-body';
import { POLICY_HANDLES } from '@/hooks/use-shopify-policies';

const policyBodyEditor: ComponentConfig<PolicyBodyProps> = {
  label: 'Policy',
  icon: <FileText size={16} />,
  category: 'content',
  defaultProps: {
    handle: '',
    title: '',
    notFoundMessage: 'This policy has not been published yet.',
  },
  fields: {
    handle: {
      label: 'Policy',
      type: 'select',
      // Empty follows the `[handle]` route segment on /policies/[handle].
      options: [
        { label: 'Follow the page URL', value: '' },
        ...POLICY_HANDLES.map((handle) => ({
          label: handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          value: handle,
        })),
      ],
    },
    title: {
      label: 'Title override',
      type: 'text',
      placeholder: "Leave empty to use the policy's own title",
      contentEditable: true,
    },
    notFoundMessage: {
      label: 'Not-found message',
      type: 'text',
      contentEditable: true,
    },
  },
  render: (props) => <PolicyBody {...props} />,
};

export default policyBodyEditor;
