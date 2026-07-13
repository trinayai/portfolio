export interface MenuItem {
  id?: string;
  label: string;
  route: string;
  order: number;
}

export interface SiteSettings {
  id?: string;
  brandName: string;
  logoUrl: string;
  footerText: string;
  menuItems: MenuItem[];
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaRoute?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaRoute?: string;
}

export interface SectionItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ContentItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutCard {
  id?: string;
  title: string;
  description: string;
}

export interface ClientItem {
  id?: string;
  name: string;
  imageUrl: string;
  website: string;
}
