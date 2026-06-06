import { useState, useCallback } from 'react';
import { useRouteSegment } from '@/hooks/use-route-segment';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { ShopifyCollection } from '@reacteditor/field-shopify';
import {
  useCollectionProducts,
  type CollectionSortKey,
  type ProductFilter,
} from '@/hooks/use-shopify-collections';
import { ProductCard } from './product-card';
import { Typography } from '@/components/Typography';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

type FilterOption = { label: string };
type ColorOption = { label: string; color: string };

export type CollectionProps = {
  collection: ShopifyCollection | null;
  showDescription: 'yes' | 'no';
  showCoverImage: 'yes' | 'no';
  customCoverImage: string;
  columns: '2' | '3' | '4';
  limit: number;
  defaultSort: CollectionSortKey;
  showAvailability: 'yes' | 'no';
  showPriceRange: 'yes' | 'no';
  showProductType: 'yes' | 'no';
  productTypeOptions: FilterOption[];
  showVendor: 'yes' | 'no';
  vendorOptions: FilterOption[];
  showTags: 'yes' | 'no';
  tagOptions: FilterOption[];
  showColor: 'yes' | 'no';
  colorOptions: ColorOption[];
  showStyle: 'yes' | 'no';
  styleOptions: FilterOption[];
  showSize: 'yes' | 'no';
  sizeOptions: FilterOption[];
  showMaterial: 'yes' | 'no';
  materialOptions: FilterOption[];
  metafieldFilters: { namespace: string; key: string; label: string; values: { label: string }[] }[];
};

const SORT_OPTIONS: { label: string; value: CollectionSortKey }[] = [
  { label: 'Best Selling', value: 'BEST_SELLING' },
  { label: 'Newest',       value: 'CREATED'      },
  { label: 'Price: Low to High', value: 'PRICE'  },
  { label: 'Alphabetical', value: 'TITLE'        },
];

const colClass: Record<CollectionProps['columns'], string> = {
  '2': 'grid-cols-2',
  '3': 'grid-cols-2 md:grid-cols-3',
  '4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

// ─── Filter group (collapsible) ────────────────────────────────────────────────

function FilterGroup({ label, children, defaultOpen = true }: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-foreground"
      >
        {label}
        <ChevronDown
          size={14}
          className={cn('transition-transform', open ? 'rotate-180' : '')}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Checkbox({ checked, onChange, label }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
          checked ? 'border-foreground bg-foreground' : 'border-border',
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-background" aria-hidden>
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────────

type ActiveFilters = {
  availability: boolean;
  productTypes: string[];
  vendors: string[];
  tags: string[];
  colors: string[];
  styles: string[];
  sizes: string[];
  materials: string[];
  minPrice: string;
  maxPrice: string;
  metafieldValues: Record<string, string[]>;
};

function Sidebar({
  props,
  active,
  onChange,
}: {
  props: CollectionProps;
  active: ActiveFilters;
  onChange: (patch: Partial<ActiveFilters>) => void;
}) {
  const productTypes = (props.productTypeOptions ?? []).map((o) => o.label).filter(Boolean);
  const vendors = (props.vendorOptions ?? []).map((o) => o.label).filter(Boolean);
  const tags = (props.tagOptions ?? []).map((o) => o.label).filter(Boolean);
  const colors = (props.colorOptions ?? []) as ColorOption[];
  const styles = (props.styleOptions ?? []).map((o) => o.label).filter(Boolean);
  const sizes = (props.sizeOptions ?? []).map((o) => o.label).filter(Boolean);
  const materials = (props.materialOptions ?? []).map((o) => o.label).filter(Boolean);
  const metafieldFilters = (props.metafieldFilters ?? []).filter((mf) => mf.namespace && mf.key);

  function toggle(key: 'productTypes' | 'vendors' | 'tags' | 'colors' | 'styles' | 'sizes' | 'materials', value: string) {
    const arr = active[key];
    onChange({ [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] });
  }

  return (
    <div className="w-full">
      {props.showAvailability === 'yes' && (
        <FilterGroup label="Availability">
          <Checkbox
            checked={active.availability}
            onChange={(v) => onChange({ availability: v })}
            label="In stock"
          />
        </FilterGroup>
      )}

      {props.showPriceRange === 'yes' && (
        <FilterGroup label="Price">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={active.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={active.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            />
          </div>
        </FilterGroup>
      )}

      {props.showVendor === 'yes' && vendors.length > 0 && (
        <FilterGroup label="Brand">
          {vendors.map((v) => (
            <Checkbox
              key={v}
              checked={active.vendors.includes(v)}
              onChange={() => toggle('vendors', v)}
              label={v}
            />
          ))}
        </FilterGroup>
      )}

      {props.showColor === 'yes' && colors.length > 0 && (
        <FilterGroup label="Color">
          {colors.filter((c) => c.label).map((c) => (
            <label
              key={c.label}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={active.colors.includes(c.label)}
                onChange={() => toggle('colors', c.label)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 rounded-full border-2',
                  active.colors.includes(c.label) ? 'border-foreground' : 'border-transparent',
                )}
                style={{ backgroundColor: c.color || undefined }}
              />
              {c.label}
            </label>
          ))}
        </FilterGroup>
      )}

      {props.showStyle === 'yes' && styles.length > 0 && (
        <FilterGroup label="Style">
          {styles.map((s) => (
            <Checkbox
              key={s}
              checked={active.styles.includes(s)}
              onChange={() => toggle('styles', s)}
              label={s}
            />
          ))}
        </FilterGroup>
      )}

      {props.showSize === 'yes' && sizes.length > 0 && (
        <FilterGroup label="Size">
          {sizes.map((s) => (
            <Checkbox
              key={s}
              checked={active.sizes.includes(s)}
              onChange={() => toggle('sizes', s)}
              label={s}
            />
          ))}
        </FilterGroup>
      )}

      {props.showMaterial === 'yes' && materials.length > 0 && (
        <FilterGroup label="Material">
          {materials.map((m) => (
            <Checkbox
              key={m}
              checked={active.materials.includes(m)}
              onChange={() => toggle('materials', m)}
              label={m}
            />
          ))}
        </FilterGroup>
      )}

      {props.showProductType === 'yes' && productTypes.length > 0 && (
        <FilterGroup label="Product type">
          {productTypes.map((pt) => (
            <Checkbox
              key={pt}
              checked={active.productTypes.includes(pt)}
              onChange={() => toggle('productTypes', pt)}
              label={pt}
            />
          ))}
        </FilterGroup>
      )}

      {props.showTags === 'yes' && tags.length > 0 && (
        <FilterGroup label="Tags">
          {tags.map((t) => (
            <Checkbox
              key={t}
              checked={active.tags.includes(t)}
              onChange={() => toggle('tags', t)}
              label={t}
            />
          ))}
        </FilterGroup>
      )}

      {metafieldFilters.map((mf, i) => {
        const mfKey = `${mf.namespace}.${mf.key}`;
        const selected = active.metafieldValues[mfKey] ?? [];
        return (
          <FilterGroup key={mfKey + i} label={mf.label || mfKey}>
            {mf.values.map((v) => v.label).filter(Boolean).map((val) => (
              <Checkbox
                key={val}
                checked={selected.includes(val)}
                onChange={(checked) => {
                  const next = checked
                    ? [...selected, val]
                    : selected.filter((v) => v !== val);
                  onChange({ metafieldValues: { ...active.metafieldValues, [mfKey]: next } });
                }}
                label={val}
              />
            ))}
          </FilterGroup>
        );
      })}
    </div>
  );
}

// ─── Build Shopify ProductFilter array ──────────────────────────────────────────

function buildProductFilters(active: ActiveFilters): ProductFilter[] {
  const filters: ProductFilter[] = [];

  if (active.availability) filters.push({ available: true });

  if (active.minPrice !== '' || active.maxPrice !== '') {
    filters.push({
      price: {
        min: active.minPrice !== '' ? parseFloat(active.minPrice) : undefined,
        max: active.maxPrice !== '' ? parseFloat(active.maxPrice) : undefined,
      },
    });
  }

  for (const pt of active.productTypes) filters.push({ productType: pt });
  for (const v of active.vendors) filters.push({ productVendor: v });
  for (const t of active.tags) filters.push({ tag: t });

  for (const c of active.colors) filters.push({ variantOption: { name: 'Color', value: c } });
  for (const s of active.styles) filters.push({ variantOption: { name: 'Style', value: s } });
  for (const s of active.sizes) filters.push({ variantOption: { name: 'Size', value: s } });
  for (const m of active.materials) filters.push({ variantOption: { name: 'Material', value: m } });

  for (const [mfKey, vals] of Object.entries(active.metafieldValues)) {
    const [namespace, key] = mfKey.split('.');
    for (const value of vals) {
      filters.push({ productMetafield: { namespace, key, value } });
    }
  }

  return filters;
}

// ─── Main component ──────────────────────────────────────────────────────────

export function CollectionView(props: CollectionProps) {
  const { collection: selected, showDescription, showCoverImage, customCoverImage, columns, limit, defaultSort } = props;
  const routeHandle = useRouteSegment();
  const handle = selected?.handle ?? routeHandle ?? '';

  const [sort, setSort] = useState<CollectionSortKey>(defaultSort);
  const [reverse, setReverse] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [active, setActive] = useState<ActiveFilters>({
    availability: false,
    productTypes: [],
    vendors: [],
    tags: [],
    colors: [],
    styles: [],
    sizes: [],
    materials: [],
    minPrice: '',
    maxPrice: '',
    metafieldValues: {},
  });

  const patchActive = useCallback((patch: Partial<ActiveFilters>) => {
    setActive((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearAll = useCallback(() => {
    setActive({
      availability: false,
      productTypes: [],
      vendors: [],
      tags: [],
      colors: [],
      styles: [],
      sizes: [],
      materials: [],
      minPrice: '',
      maxPrice: '',
      metafieldValues: {},
    });
  }, []);

  const productFilters = buildProductFilters(active);

  const handleSortChange = (value: string) => {
    if (value === 'PRICE_DESC') {
      setSort('PRICE');
      setReverse(true);
    } else {
      setSort(value as CollectionSortKey);
      setReverse(false);
    }
  };

  const sortValue = sort === 'PRICE' && reverse ? 'PRICE_DESC' : sort;

  const { collection, loading, hasNextPage, fetchMore } = useCollectionProducts(handle, {
    first: limit,
    sortKey: sort,
    reverse,
    filters: productFilters.length ? productFilters : undefined,
  });

  const products = collection?.products ?? [];
  const description = collection?.description ?? (selected as any)?.description;
  const collectionImage = customCoverImage || collection?.image?.url;

  if (!selected && !routeHandle) {
    return (
      <section className="bg-background pb-24 pt-12 md:pt-20">
        <Container>
          <header className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-3 text-center">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
          </header>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-background pb-24 pt-12 md:pt-20">
      <Container>
        {/* Cover image */}
        {showCoverImage === 'yes' && collectionImage && (
          <div className="mb-10 overflow-hidden rounded-lg">
            <img
              src={collectionImage}
              alt={collection?.title ?? ''}
              className="h-48 w-full object-cover md:h-72 lg:h-80"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Collection
          </p>
          <Typography variant="h1">
            {collection?.title ?? (selected as any)?.title ?? routeHandle}
          </Typography>
          {showDescription === 'yes' && description ? (
            <Typography variant="subtitle1" className="mt-4 max-w-2xl">
              {description}
            </Typography>
          ) : null}
        </header>

        {/* Filter + sort bar */}
        <div className="mb-6 flex items-center justify-between">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4">
                <Sidebar props={props} active={active} onChange={patchActive} />
              </div>
              <SheetFooter className="flex-row gap-2 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={clearAll}>
                  Clear
                </Button>
                <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
                  Search
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4">
            <p className="hidden text-sm text-muted-foreground sm:block">
              {loading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
            </p>
            <Select value={sortValue} onValueChange={handleSortChange}>
              <SelectTrigger className="h-auto px-3 py-2 text-sm">
                <SelectValue>
                  {[...SORT_OPTIONS, { label: 'Price: High to Low', value: 'PRICE_DESC' }].find((o) => o.value === sortValue)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
                <SelectItem value="PRICE_DESC">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        <div className={cn('grid gap-x-6 gap-y-10', colClass[columns])}>
          {loading
            ? Array.from({ length: limit }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full" />
              ))
            : products.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!loading && products.length === 0 && (
          <div className="mt-16 text-center text-sm text-muted-foreground">
            No products found in this collection.
          </div>
        )}

        {hasNextPage && !loading && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={fetchMore}
              className="rounded-md border border-border px-8 py-3 text-sm font-medium hover:bg-muted"
            >
              Load more
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
