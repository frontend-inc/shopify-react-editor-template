'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  AnimatePresence,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RiCloseLine, RiCheckLine } from '@remixicon/react';
import { swatchColorForName } from '@/config/swatches';
// Shape of a Storefront facet — identical for `search.productFilters` and
// `collection.products.filters`, so both pages share this panel.
export interface ProductFilterValue {
  id: string;
  label: string;
  count: number;
  /** JSON string accepted back as a `ProductFilter` input. */
  input: string;
}

export interface ProductFilterFacet {
  id: string;
  label: string;
  type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN';
  values: ProductFilterValue[];
}

interface ProductFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ProductFilterFacet[];
  activeFilters: string[];
  onActiveFiltersChange: (filters: string[]) => void;
}

// Colour facets render as swatches; everything else as a labelled list.
const isColorFilter = (filter: ProductFilterFacet) =>
  /colou?r/i.test(filter.label) || filter.id.toLowerCase().includes('color');

const ProductFilters: React.FC<ProductFiltersProps> = ({
  open,
  onOpenChange,
  filters,
  activeFilters,
  onActiveFiltersChange,
}) => {
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const listFilters = filters.filter((filter) => filter.type === 'LIST');
  const priceFilter = filters.find((filter) => filter.type === 'PRICE_RANGE');

  const activeSet = new Set(activeFilters);
  // Price is rebuilt from the inputs rather than toggled, so track it apart.
  const activePriceInput = activeFilters.find((input) =>
    input.includes('"price"')
  );

  const toggleValue = (value: ProductFilterValue) => {
    onActiveFiltersChange(
      activeSet.has(value.input)
        ? activeFilters.filter((input) => input !== value.input)
        : [...activeFilters, value.input]
    );
  };

  const applyPrice = () => {
    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    const withoutPrice = activeFilters.filter(
      (input) => !input.includes('"price"')
    );

    if (Number.isNaN(min) && Number.isNaN(max)) {
      onActiveFiltersChange(withoutPrice);
      return;
    }

    const price: { min?: number; max?: number } = {};
    if (!Number.isNaN(min)) price.min = min;
    if (!Number.isNaN(max)) price.max = max;

    onActiveFiltersChange([...withoutPrice, JSON.stringify({ price })]);
  };

  const clearAll = () => {
    setPriceMin('');
    setPriceMax('');
    onActiveFiltersChange([]);
  };

  // Labels for the chips at the top of the panel.
  const activeChips = filters
    .flatMap((filter) => filter.values)
    .filter((value) => activeSet.has(value.input));

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <AnimatePresence>
        {open && (
          <SheetContent className="w-full max-w-sm" showCloseButton={false}>
            <SheetHeader className="min-h-0 border-b-0 px-5 py-4">
              <div className="flex w-full items-center justify-between">
                <SheetTitle className="text-lg font-medium">Filters</SheetTitle>
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close filters"
                >
                  <RiCloseLine size={20} />
                </Button>
              </div>
            </SheetHeader>

            <SheetBody className="px-5">
              {/* Active selections */}
              {(activeChips.length > 0 || activePriceInput) && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  {activeChips.map((value) => (
                    <button
                      key={value.id}
                      onClick={() => toggleValue(value)}
                      className="flex items-center gap-x-1 rounded-md bg-secondary px-2 py-1 text-xs text-foreground"
                    >
                      {value.label}
                      <RiCloseLine size={12} />
                    </button>
                  ))}
                  <Button
                    onClick={clearAll}
                    variant="link"
                    className="h-auto px-0 text-xs font-normal text-muted-foreground"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {filters.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No filters available for these results.
                </p>
              )}

              {/* Price */}
              {priceFilter && (
                <div className="mb-8">
                  <h3 className="mb-3 text-base text-foreground">Price</h3>
                  <div className="flex items-center gap-x-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={priceMin}
                      onChange={(event) => setPriceMin(event.target.value)}
                      placeholder="$ From"
                      aria-label="Minimum price"
                      className="h-10 w-full rounded-md bg-secondary px-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <span className="text-muted-foreground">–</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={priceMax}
                      onChange={(event) => setPriceMax(event.target.value)}
                      placeholder="$ To"
                      aria-label="Maximum price"
                      className="h-10 w-full rounded-md bg-secondary px-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <Button
                      onClick={applyPrice}
                      size="icon"
                      aria-label="Apply price range"
                      className="shrink-0"
                    >
                      <RiCheckLine size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Facets */}
              {listFilters.map((filter) => (
                <div key={filter.id} className="mb-8">
                  <h3 className="mb-3 text-base text-foreground">
                    {filter.label}
                  </h3>

                  {isColorFilter(filter) ? (
                    <div className="flex flex-wrap gap-2">
                      {filter.values.map((value) => {
                        const isActive = activeSet.has(value.input);
                        const color = swatchColorForName(value.label);

                        return (
                          <button
                            key={value.id}
                            onClick={() => toggleValue(value)}
                            title={`${value.label} (${value.count})`}
                            aria-label={value.label}
                            aria-pressed={isActive}
                            className={`h-8 w-8 rounded-full transition-shadow ${
                              isActive
                                ? 'ring-2 ring-foreground ring-offset-2'
                                : 'ring-1 ring-border hover:ring-foreground/40'
                            }`}
                            style={{
                              // A colourless swatch would otherwise be a fully
                              // transparent circle behind a hairline ring,
                              // which antialiases into a speckled border.
                              backgroundColor: color ?? 'var(--color-muted)',
                            }}
                          >
                            {!color && (
                              <span className="text-[10px] font-medium uppercase text-muted-foreground">
                                {value.label.at(0)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {filter.values.map((value) => {
                        const isActive = activeSet.has(value.input);

                        return (
                          <button
                            key={value.id}
                            onClick={() => toggleValue(value)}
                            aria-pressed={isActive}
                            className="flex items-center justify-between py-1.5 text-left text-sm text-foreground hover:text-muted-foreground"
                          >
                            <span>
                              {value.label} ({value.count})
                            </span>
                            {isActive && <RiCheckLine size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </SheetBody>
          </SheetContent>
        )}
      </AnimatePresence>
    </Sheet>
  );
};

export default ProductFilters;
