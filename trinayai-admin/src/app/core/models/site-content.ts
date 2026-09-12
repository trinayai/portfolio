export interface MenuItem {
  id?: string;
  label: string;
  route: string;
  order: number;
  isVisible?: boolean;
}

export interface SiteSettings {
  id?: string;
  brandName: string;
  logoUrl: string;
  footerText: string;
  contactEmail?: string;
  showIndiaAiBadge?: boolean;
  menuItems: MenuItem[];
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaRoute?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaRoute?: string;
  homeDescription?: string;
  homeScaleTitle?: string;
  homeScaleDescription?: string;
  homeScaleCtaText?: string;
  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutIntro?: string;
  aboutBody?: string;
  aboutTimelineTitle?: string;
  clientsEyebrow?: string;
  clientsTitle?: string;
  clientsDescription?: string;
  clientsCtaTitle?: string;
  clientsCtaDescription?: string;
  clientsCtaText?: string;
  contactEyebrow?: string;
  contactTitle?: string;
  contactDescription?: string;
  contactStudioLabel?: string;
  contactHeading?: string;
  contactAddress?: string;
  contactHours?: string;
  contactFooter?: string;
  contactInterestOptions?: string[];
  aiMenuEyebrow?: string;
  aiMenuTitle?: string;
  aiMenuDescription?: string;
  aiMenuBannerLabel?: string;
  servicesEyebrow?: string;
  servicesTitle?: string;
  servicesDescription?: string;
}

export interface SectionItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  isVisible?: boolean;
}

export interface ContentItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  billingCycle?: string;
  features?: string[];
  isPopular?: boolean;
  isVisible?: boolean;
}

export interface AboutCard {
  id?: string;
  title: string;
  description: string;
  isVisible?: boolean;
}

export interface AboutEvent {
  id?: string;
  status: string;
  date: string;
  description: string;
  icon?: string;
  isVisible?: boolean;
}

export interface ClientItem {
  id?: string;
  name: string;
  imageUrl: string;
  website: string;
  isVisible?: boolean;
}
