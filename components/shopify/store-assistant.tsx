'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
  type AttachmentData,
} from '@/components/ai-elements/attachments';
import {
  Suggestions,
  Suggestion,
} from '@/components/ai-elements/suggestion';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import {
  RiCloseLine,
  RiSearchLine,
  RiPriceTag3Line,
  RiStore2Line,
  RiLayoutGridLine,
  RiShoppingBag3Line,
} from '@remixicon/react';

// Feature flag. Written as a static member expression so Next inlines it at
// build time; the assistant is off unless the env var is explicitly "1".
const AI_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AI === '1';

const SUGGESTIONS = [
  'What do you sell?',
  'Show me hoodies under $100',
  'What collections are there?',
];

interface ToolProduct {
  handle: string;
  title: string;
  image: string | null;
  price?: string;
}

interface ToolSummary {
  label: string;
  icon: React.ReactNode;
  products: ToolProduct[];
}

const LOADING_LABELS: Record<string, string> = {
  searchCatalogue: 'Searching the catalogue',
  getProductDetails: 'Reading product details',
  listCollections: 'Listing collections',
  getCollectionProducts: 'Browsing a collection',
  browseProducts: 'Browsing new arrivals',
};

const toolName = (type: string) =>
  type.startsWith('tool-') ? type.slice(5) : type;

const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;

// Turns a finished tool result into the one-line summary plus any products
// worth previewing.
const summariseTool = (
  name: string,
  output: Record<string, unknown> | undefined
): ToolSummary => {
  const products = (output?.products as ToolProduct[] | undefined) ?? [];

  switch (name) {
    case 'searchCatalogue': {
      const total = (output?.totalCount as number) ?? products.length;
      return {
        label: `Found ${plural(total, 'product')}`,
        icon: <RiSearchLine className="size-3.5" />,
        products,
      };
    }
    case 'getProductDetails':
      return {
        label: output?.found
          ? `Read ${output.title as string}`
          : 'Product not found',
        icon: <RiPriceTag3Line className="size-3.5" />,
        products: output?.found
          ? [
              {
                handle: output.handle as string,
                title: output.title as string,
                image: (output.image as string) ?? null,
              },
            ]
          : [],
      };
    case 'listCollections': {
      const collections =
        (output?.collections as Array<unknown> | undefined) ?? [];
      return {
        label: `Found ${plural(collections.length, 'collection')}`,
        icon: <RiStore2Line className="size-3.5" />,
        products: [],
      };
    }
    case 'getCollectionProducts':
      return {
        label: output?.found
          ? `Found ${plural(products.length, 'product')} in ${output.collection}`
          : 'Collection not found',
        icon: <RiLayoutGridLine className="size-3.5" />,
        products,
      };
    case 'browseProducts':
      return {
        label: `Browsed ${plural(products.length, 'new arrival')}`,
        icon: <RiShoppingBag3Line className="size-3.5" />,
        products,
      };
    default:
      return {
        label: name,
        icon: <RiSearchLine className="size-3.5" />,
        products,
      };
  }
};

// Storefront links stay in-app, so they skip Streamdown's external-link modal.
const isInternalLink = (url: string) => {
  if (url.startsWith('/')) return true;
  try {
    return new URL(url, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
};

const ProductPreviews: React.FC<{ products: ToolProduct[] }> = ({
  products,
}) => {
  const withImages = products.filter((product) => product.image);
  if (withImages.length === 0) return null;

  return (
    <Attachments variant="grid" className="ml-0 mt-2">
      {withImages.slice(0, 6).map((product) => (
        <Link
          key={product.handle}
          href={`/products/${product.handle}`}
          title={product.title}
          className="group/product w-20"
        >
          <Attachment
            data={{
              id: product.handle,
              type: 'file',
              url: product.image as string,
              mediaType: 'image/jpeg',
              filename: product.title,
            }}
            className="size-20"
          >
            <AttachmentPreview />
          </Attachment>
          <span className="mt-1 line-clamp-2 block text-[11px] leading-tight text-muted-foreground group-hover/product:text-foreground">
            {product.title}
          </span>
        </Link>
      ))}
    </Attachments>
  );
};

interface AttachmentItemProps {
  attachment: AttachmentData;
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  const mediaCategory = getMediaCategory(attachment);
  const label = getAttachmentLabel(attachment);

  return (
    <AttachmentHoverCard key={attachment.id}>
      <AttachmentHoverCardTrigger asChild>
        <Attachment data={attachment} onRemove={handleRemove}>
          {/* Thumbnail swaps to the remove button on hover. */}
          <div className="group relative size-5 shrink-0">
            <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
              <AttachmentPreview />
            </div>
            <AttachmentRemove className="absolute inset-0" />
          </div>
          <AttachmentInfo />
        </Attachment>
      </AttachmentHoverCardTrigger>
      <AttachmentHoverCardContent>
        <div className="space-y-2">
          {mediaCategory === 'image' &&
            attachment.type === 'file' &&
            attachment.url && (
              <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
                <img
                  alt={label}
                  className="max-h-full max-w-full object-contain"
                  height={384}
                  src={attachment.url}
                  width={320}
                />
              </div>
            )}
          <div className="space-y-1 px-0.5">
            <h4 className="text-sm font-semibold leading-none">{label}</h4>
            {attachment.mediaType && (
              <p className="font-mono text-xs text-muted-foreground">
                {attachment.mediaType}
              </p>
            )}
          </div>
        </div>
      </AttachmentHoverCardContent>
    </AttachmentHoverCard>
  );
});

AttachmentItem.displayName = 'AttachmentItem';

// Pending uploads, shown inline above the textarea.
const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments]
  );

  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="inline" className="w-full justify-start px-2 pt-2">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  );
};

const StoreAssistant: React.FC = () => {
  // Returns before any hooks run — safe because the flag is a build-time
  // constant and cannot change between renders.
  if (!AI_ENABLED) return null;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');

  // Drives the launcher's slide-in on first paint.
  useEffect(() => setMounted(true), []);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  const launcherClasses = `fixed bottom-6 right-4 z-50 rounded-full px-6 shadow-lg transition-all duration-500 sm:right-6 ${
    mounted ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
  }`;

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  // Attachments arrive on the submitted message, so images go out with it.
  const handleSubmit = (message: PromptInputMessage) => {
    const text = (message.text ?? input).trim();
    const files = message.files ?? [];
    if ((!text && files.length === 0) || isBusy) return;

    sendMessage({ text, files });
    setInput('');
  };

  return (
    <>
      {/* Popover panel, anchored above the launcher */}
      <div
        aria-hidden={!open}
        className={`fixed bottom-20 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl transition-all duration-200 sm:right-6 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0'
        }`}
        style={{ height: 'min(32rem, calc(100vh - 8rem))' }}
      >
        <header className="flex h-12 shrink-0 items-center justify-between pl-4 pr-2">
          <span className="text-sm font-medium">Store Assistant</span>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            size="icon-sm"
            aria-label="Close assistant"
            className="rounded-full"
          >
            <RiCloseLine className="size-4" />
          </Button>
        </header>

        <Conversation className="flex-1">
          <ConversationContent className="gap-4 p-3">
            {messages.length === 0 && (
              <ConversationEmptyState
                title="Ask about the store"
                description="Find products, compare options, browse collections."
              >
                {/* w-full + wrap so chips stack in the narrow popover rather
                    than scrolling off the edge. */}
                <Suggestions className="mt-3 w-full flex-wrap justify-center">
                  {SUGGESTIONS.map((suggestion) => (
                    <Suggestion
                      key={suggestion}
                      onClick={send}
                      suggestion={suggestion}
                      className="font-normal"
                    />
                  ))}
                </Suggestions>
              </ConversationEmptyState>
            )}

            {messages.map((message) => {
              const fileParts = message.parts.filter(
                (part) => part.type === 'file'
              );

              return (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return (
                        <MessageResponse
                          key={index}
                          // Only repair half-written markdown while it streams;
                          // settled text is rendered exactly as sent.
                          isAnimating={
                            status === 'streaming' && part.state === 'streaming'
                          }
                          linkSafety={{
                            enabled: true,
                            onLinkCheck: isInternalLink,
                          }}
                        >
                          {part.text}
                        </MessageResponse>
                      );
                    }

                    if (part.type === 'reasoning') {
                      return (
                        <Reasoning
                          key={index}
                          className="w-full"
                          isStreaming={
                            status === 'streaming' &&
                            part.state === 'streaming'
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    }

                    if (part.type.startsWith('tool-')) {
                      const toolPart = part as typeof part & {
                        state: string;
                        output?: Record<string, unknown>;
                        errorText?: string;
                      };
                      const name = toolName(part.type);

                      // Shimmer while the call is in flight; a quiet summary
                      // line once it returns.
                      if (
                        toolPart.state === 'input-streaming' ||
                        toolPart.state === 'input-available'
                      ) {
                        return (
                          <Shimmer key={index} className="text-xs">
                            {LOADING_LABELS[name] ?? name}
                          </Shimmer>
                        );
                      }

                      if (toolPart.state === 'output-error') {
                        return (
                          <p key={index} className="text-xs text-muted-foreground">
                            Couldn&apos;t load that.
                          </p>
                        );
                      }

                      const { label, icon, products } = summariseTool(
                        name,
                        toolPart.output
                      );

                      return (
                        <div key={index} className="my-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {icon}
                            {label}
                          </div>
                          <ProductPreviews products={products} />
                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* Images the shopper attached, shown under their message. */}
                  {fileParts.length > 0 && (
                    <Attachments variant="grid" className="ml-0 justify-start">
                      {fileParts.map((part, index) => (
                        <Attachment
                          key={`${message.id}-file-${index}`}
                          data={{
                            id: `${message.id}-file-${index}`,
                            type: 'file',
                            url: part.url,
                            mediaType: part.mediaType,
                            filename: part.filename,
                          }}
                          className="size-20"
                        >
                          <AttachmentPreview />
                        </Attachment>
                      ))}
                    </Attachments>
                  )}
                </MessageContent>
              </Message>
              );
            })}

            {status === 'submitted' && (
              <Shimmer className="text-xs">Thinking</Shimmer>
            )}

            {error && (
              <p className="text-xs text-destructive">
                Something went wrong. Please try again.
              </p>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="shrink-0 p-2">
          <PromptInputProvider>
            <PromptInput
              globalDrop
              multiple
              accept="image/*"
              onSubmit={handleSubmit}
              className="rounded-lg"
            >
              <PromptInputAttachmentsDisplay />
              <PromptInputBody>
                <PromptInputTextarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about products…"
                  className="min-h-12"
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>
                <PromptInputSubmit status={status} />
              </PromptInputFooter>
            </PromptInput>
          </PromptInputProvider>
        </div>
      </div>

      {/* Launcher */}
      {/* Rainbow treatment only while the assistant is open; otherwise the
          launcher matches the rest of the site's buttons. */}
      {open ? (
        <RainbowButton
          onClick={() => setOpen(false)}
          aria-label="Close store assistant"
          aria-expanded
          size="lg"
          className={launcherClasses}
        >
          Ask
        </RainbowButton>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          aria-label="Open store assistant"
          aria-expanded={false}
          className={`h-11 ${launcherClasses}`}
        >
          Ask
        </Button>
      )}
    </>
  );
};

export default StoreAssistant;
