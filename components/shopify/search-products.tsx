import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useShopifySearch, type SearchFilters, type SortOption } from '@/hooks/use-shopify-search';

import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

type FilterOption = { label: string };
type ColorOption = { label: string; color: string };

export type SearchProductsProps = {
  heading: string;
  subheading: string;
  columns: '2' | '3' | '4';
  limit: number;
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
  defaultSort: SortOption;
};

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Relevance',          value: 'RELEVANCE'    },
  { label: 'Best Selling',       value: 'BEST_SELLING' },
  { label: 'Newest',             value: 'NEWEST'       },
  { label: 'Price: Low to High', value: 'PRICE_ASC'    },
  { label: 'Price: High to Low', value: 'PRICE_DESC'   },
  { label: 'Alphabetical',       value: 'TITLE_ASC'    },
];

const colClass: Record<SearchProductsProps['columns'], string> = {
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
  props: SearchProductsProps;
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

// ─── Main component ──────────────────────────────────────────────────────────

export function SearchProductsView(props: SearchProductsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialQ = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [sort, setSort] = useState<SortOption>(props.defaultSort);
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

  const filters: SearchFilters = {
    q: query,
    sort,
    availability: active.availability || undefined,
    productTypes: active.productTypes.length ? active.productTypes : undefined,
    vendors: active.vendors.length ? active.vendors : undefined,
    tags: active.tags.length ? active.tags : undefined,
    colors: active.colors.length ? active.colors : undefined,
    styles: active.styles.length ? active.styles : undefined,
    sizes: active.sizes.length ? active.sizes : undefined,
    materials: active.materials.length ? active.materials : undefined,
    minPrice: active.minPrice !== '' ? parseFloat(active.minPrice) : undefined,
    maxPrice: active.maxPrice !== '' ? parseFloat(active.maxPrice) : undefined,
    metafields: (() => {
      const mfs = Object.entries(active.metafieldValues).flatMap(([mfKey, vals]) => {
        const [namespace, key] = mfKey.split('.');
        return vals.map((value) => ({ namespace, key, value }));
      });
      return mfs.length ? mfs : undefined;
    })(),
  };

  const { products, loading, error, hasNextPage, fetchMore } = useShopifySearch(filters, {
    first: props.limit,
  });

  // Sync ?q= param when query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set('q', query); else params.delete('q');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue.trim());
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <Container>

        {/* Page header */}
        <div className="mb-10">
          {props.heading && (
            <h1 className="mb-2 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {props.heading}
            </h1>
          )}
          {props.subheading && (
            <p className="text-muted-foreground">{props.subheading}</p>
          )}
          {/* Search bar (mobile only – desktop version lives in the product area) */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 md:hidden">
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products…"
              className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground"
            />
            <button
              type="submit"
              className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search bar (desktop only — mobile lives in header above) */}
        <form onSubmit={handleSearch} className="mb-4 hidden gap-2 md:flex">
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products…"
            className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            Search
          </button>
        </form>

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
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="h-auto px-3 py-2 text-sm">
                <SelectValue>{SORT_OPTIONS.find((o) => o.value === sort)?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">
            {error}
          </p>
        )}

        {/* Grid */}
        <div className={cn('grid gap-x-6 gap-y-10', colClass[props.columns])}>
          {loading
            ? Array.from({ length: props.limit }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full" />
              ))
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!loading && products.length === 0 && !error && (
          <div className="mt-16 text-center text-sm text-muted-foreground">
            No products found.{query ? ` Try a different search term.` : ''}
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
