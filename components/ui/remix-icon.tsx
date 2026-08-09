'use client';

import React from 'react';
import * as RemixIcons from '@remixicon/react';

interface RemixIconProps {
  name: string; // e.g. "RiTruckLine"
  className?: string;
  size?: number;
}

const RemixIcon: React.FC<RemixIconProps> = ({
  name,
  className,
  size = 16,
}) => {
  if (!name) return null;

  // Normalise: accept "RiTruckLine", "ri-truck-line", or "riTruckLine"
  const normalised = name
    // ri-truck-line → RiTruckLine
    .replace(/^ri-/, 'Ri')
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    // ensure first char is uppercase
    .replace(/^./, (c) => c.toUpperCase());

  const IconComponent = (
    RemixIcons as Record<
      string,
      React.FC<{ className?: string; size?: number }>
    >
  )[normalised];

  if (!IconComponent) {
    console.warn(
      `[RemixIcon] Icon "${name}" (resolved: "${normalised}") not found.`
    );
    return null;
  }

  return <IconComponent className={className} size={size} />;
};

export default RemixIcon;
