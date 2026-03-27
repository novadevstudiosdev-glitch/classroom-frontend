export interface BackForwardNavigationItem {
  href: string;
  label?: string;
  className?: string;
}

export interface BackForwardNavigationProps {
  previous?: BackForwardNavigationItem;
  next?: BackForwardNavigationItem;
  containerClassName?: string;
  buttonClassName?: string;
}
