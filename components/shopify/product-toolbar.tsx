'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  RiEqualizerLine,
  RiArrowDownSLine,
  RiCheckLine,
} from '@remixicon/react';

export interface ToolbarSortOption {
  label: string;
}

interface ProductToolbarProps {
  totalCount?: number | null;
  onOpenFilters: () => void;
  sortOptions: ToolbarSortOption[];
  sortIndex: number;
  onSortChange: (index: number) => void;
  activeFilterCount?: number;
}

const ProductToolbar: React.FC<ProductToolbarProps> = ({
  totalCount,
  onOpenFilters,
  sortOptions,
  sortIndex,
  onSortChange,
  activeFilterCount = 0,
}) => {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Button
        onClick={onOpenFilters}
        variant="ghost"
        className="gap-x-2 px-0 font-normal hover:bg-transparent"
      >
        <RiEqualizerLine size={18} />
        Filters
        {activeFilterCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[11px] font-medium text-background">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <div className="flex items-center gap-x-4">
        {typeof totalCount === 'number' && (
          <span className="text-sm text-muted-foreground tabular-nums">
            {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
          </span>
        )}

        <div className="relative">
          <Button
            onClick={() => setSortOpen((prev) => !prev)}
            variant="ghost"
            aria-expanded={sortOpen}
            className="gap-x-1 px-0 font-normal hover:bg-transparent"
          >
            Sort
            <RiArrowDownSLine size={16} />
          </Button>

          {sortOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-border bg-background py-1 shadow-md">
                {sortOptions.map((option, index) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      onSortChange(index);
                      setSortOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-foreground hover:bg-accent"
                  >
                    {option.label}
                    {index === sortIndex && <RiCheckLine size={16} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
