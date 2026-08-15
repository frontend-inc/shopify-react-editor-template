import React from 'react';
import {
  RiInstagramLine,
  RiTiktokLine,
  RiFacebookFill,
} from '@remixicon/react';
import Logo from '@/components/logo';

export interface FooterLink {
  label: string;
  url: string;
}

interface FooterProps {
  storeName?: string;
  logoUrl?: string;
  copyright?: string;
  links?: FooterLink[];
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
}

const Footer: React.FC<FooterProps> = ({
  storeName = 'Shop',
  logoUrl,
  copyright,
  links = [
    { label: 'Terms of Service', url: '/policies/terms-of-service' },
    { label: 'Privacy Policy', url: '/policies/privacy-policy' },
    { label: 'Refund Policy', url: '/policies/refund-policy' },
    { label: 'Shipping Policy', url: '/policies/shipping-policy' },
    { label: 'Subscription Policy', url: '/policies/subscription-policy' },
  ],
  instagramUrl = '#',
  tiktokUrl = '#',
  facebookUrl = '#',
}) => {
  const socials = [
    { label: 'Instagram', url: instagramUrl, Icon: RiInstagramLine },
    { label: 'TikTok', url: tiktokUrl, Icon: RiTiktokLine },
    { label: 'Facebook', url: facebookUrl, Icon: RiFacebookFill },
  ];

  return (
    <footer className="bg-background">
      <div className="max-w-screen-2xl mx-auto px-8 py-10">
        <div className="flex flex-col items-center gap-y-5 sm:items-start">
          <Logo
            src={logoUrl}
            storeName={storeName}
            imageClassName="h-5"
            textClassName="text-base"
          />

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:gap-x-5">
            <span className="flex items-center gap-x-4">
              {socials.map(({ label, url, Icon }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </span>

            <p className="text-sm text-muted-foreground leading-5">
              {copyright || `© ${storeName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
