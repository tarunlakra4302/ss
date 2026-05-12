export interface NavItem {
  label: string;
  href: string;
  shape?: string;
}

export const navigationConfig: NavItem[] = [
  { label: "Homepage", href: "/", shape: "1" },
  { label: "About us", href: "/about", shape: "2" },
  { label: "Services", href: "/services", shape: "3" },
  { label: "Blog", href: "/blog", shape: "4" },
  { label: "Contact us", href: "/contact", shape: "5" },
];
