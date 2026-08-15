import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { RiSubtractLine, RiAddLine } from '@remixicon/react';
import ShopPayButton from '@/components/shopify/shop-pay-button';
import type { ProductOption, ProductOptionValue } from '@/hooks/use-shopify-products';
import { isSwatchOptionName, swatchColorForName } from '@/config/swatches';
import { isDefaultTitleOption } from '@/services/shopify/shop';

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  handle: string;
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  options: ProductOption[];
}

export interface ProductFeature {
  icon: string;
  label: string;
}

interface ProductDetailInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  selectedOptions: Record<string, string>;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
  handleBuyNow?: () => void;
  onOptionChange: (optionName: string, value: string) => void;
  isOptionValueAvailable?: (optionName: string, value: string) => boolean;
  loading?: boolean;
  buyingNow?: boolean;
  addToCartLabel?: string;
}

const swatchStyle = (
  value: ProductOptionValue
): { background?: string; image?: string } => {
  if (value.swatch?.color) return { background: value.swatch.color };

  const swatchImage = value.swatch?.image?.previewImage?.url;
  if (swatchImage) return { image: swatchImage };

  const namedColor = swatchColorForName(value.name);
  if (namedColor) return { background: namedColor };

  return {};
};

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  product,
  selectedVariant,
  selectedOptions,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow,
  onOptionChange,
  isOptionValueAvailable,
  loading = false,
  buyingNow = false,
  addToCartLabel = 'Add to Cart',
}) => {
  const formatPrice = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const isAvailable = selectedVariant?.availableForSale ?? false;

  const isSwatchOption = (option: ProductOption) =>
    isSwatchOptionName(option.name);

  // Show swatches first and omit Shopify's synthetic single-SKU option.
  const orderedOptions = [...(product.options ?? [])]
    .filter((option) => !isDefaultTitleOption(option))
    .sort((a, b) => Number(isSwatchOption(b)) - Number(isSwatchOption(a)));

  const optionValuesFor = (option: ProductOption): ProductOptionValue[] =>
    option.optionValues?.length
      ? option.optionValues
      : option.values.map((value) => ({ id: value, name: value }));

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-normal text-foreground">
        {product.title}
      </h1>
      <div className="flex items-baseline gap-x-3 mt-1">
        <span className="font-mono tabular-nums tracking-tight text-base text-foreground">
          {formatPrice(price.amount)}
        </span>
        {hasDiscount && compareAtPrice && (
          <span className="font-mono tabular-nums tracking-tight text-sm line-through text-muted-foreground">
            {formatPrice(compareAtPrice.amount)}
          </span>
        )}
      </div>

      {orderedOptions.map((option) => {
        const isSwatch = isSwatchOption(option);
        const selected = selectedOptions[option.name];

        return (
          <div key={option.id} className="mt-8">
            <div className="text-sm text-muted-foreground mb-2">
              {option.name}
              {isSwatch && selected && (
                <span className="text-foreground font-medium">: {selected}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {optionValuesFor(option).map((value) => {
                const isSelected = selected === value.name;
                const isSoldOut =
                  isOptionValueAvailable?.(option.name, value.name) === false;

                if (isSwatch) {
                  const { background, image } = swatchStyle(value);

                  return (
                    <Button
                      key={value.id}
                      onClick={() => onOptionChange(option.name, value.name)}
                      variant="ghost"
                      size="icon-sm"
                      aria-label={value.name}
                      aria-pressed={isSelected}
                      title={
                        isSoldOut ? `${value.name} — out of stock` : value.name
                      }
                      data-available={!isSoldOut}
                      className={`rounded-full bg-cover bg-center hover:bg-transparent ${
                        isSelected
                          ? 'ring-2 ring-foreground ring-offset-2'
                          : 'ring-1 ring-border hover:ring-foreground/40'
                      } ${isSoldOut ? 'option-unavailable text-foreground/60 opacity-60' : ''}`}
                      style={{
                        backgroundColor:
                          background ??
                          (image ? undefined : 'var(--color-muted)'),
                        backgroundImage: image ? `url(${image})` : undefined,
                      }}
                    >
                      {!background && !image && (
                        <span className="text-[10px] font-medium uppercase text-muted-foreground">
                          {value.name.at(0)}
                        </span>
                      )}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={value.id}
                    onClick={() => onOptionChange(option.name, value.name)}
                    variant="outline"
                    aria-pressed={isSelected}
                    title={isSoldOut ? `${value.name} — out of stock` : undefined}
                    className={`min-w-14 px-5 font-normal shadow-none ${
                      isSelected
                        ? 'border-foreground text-foreground'
                        : 'text-muted-foreground hover:border-foreground hover:text-foreground'
                    } ${isSoldOut ? 'option-unavailable text-muted-foreground/60' : ''}`}
                  >
                    {value.name}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-8 flex items-stretch gap-3">
        <div className="flex items-center rounded-md border border-border h-11">
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            className="h-full rounded-none rounded-l-md"
          >
            <RiSubtractLine size={16} />
          </Button>
          <span className="w-8 text-center text-sm tabular-nums">
            {quantity}
          </span>
          <Button
            onClick={() => setQuantity(quantity + 1)}
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            className="h-full rounded-none rounded-r-md"
          >
            <RiAddLine size={16} />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable || loading}
          className="flex-1 h-11"
        >
          {loading && <Loader size={16} />}
          {isAvailable ? addToCartLabel : 'Out of Stock'}
        </Button>
      </div>

      <ShopPayButton
        className="mt-3"
        variants={
          selectedVariant ? [{ id: selectedVariant.id, quantity }] : []
        }
        disabled={!isAvailable || buyingNow}
        loading={buyingNow}
        onFallbackClick={handleBuyNow}
      />

      {(product.descriptionHtml || product.description) && (
        <div className="mt-10 text-sm leading-6 text-foreground product-description">
          {product.descriptionHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <p>{product.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailInfo;
