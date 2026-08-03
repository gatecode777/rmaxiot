"use client";

import React, { useEffect } from 'react';
import NextLink from 'next/link';
import { 
  useParams as useNextParams, 
  useRouter as useNextRouter, 
  usePathname as useNextPathname, 
  useSearchParams as useNextSearchParams 
} from 'next/navigation';

export function useParams() {
  const params = useNextParams();
  return params || {};
}

export function useNavigate() {
  const router = useNextRouter();
  return (to, options) => {
    if (typeof to === 'number') {
      if (to < 0) {
        router.back();
      } else {
        router.forward();
      }
    } else if (to && typeof to === 'object') {
      // React Router supports navigate({pathname, search, hash, state})
      const { pathname = '/', search = '', hash = '' } = to;
      const url = `${pathname}${search}${hash}`;
      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    } else {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  };
}

export function useLocation() {
  const pathname = useNextPathname();
  const searchParams = useNextSearchParams();
  return {
    pathname: pathname || '',
    search: searchParams ? `?${searchParams.toString()}` : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null,
  };
}

export const Link = React.forwardRef(({ to, ...props }, ref) => {
  // Handle object-form `to` like {pathname, search, state}
  const href = to && typeof to === 'object'
    ? `${to.pathname || '/'}${to.search || ''}${to.hash || ''}`
    : to;
  return <NextLink href={href || '/'} {...props} ref={ref} />;
});
Link.displayName = 'Link';

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useNextRouter();
  const pathname = useNextPathname();
  
  const setSearchParams = (newParams) => {
    const current = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (typeof newParams === 'function') {
      // Handle functional updates if needed
      console.warn('Functional updates to searchParams not fully supported in simple compat layer');
    } else {
      for (const [key, value] of Object.entries(newParams)) {
        if (value === undefined || value === null) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      }
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };
  
  return [searchParams || new URLSearchParams(), setSearchParams];
}

export function Navigate({ to, replace }) {
  const router = useNextRouter();
  useEffect(() => {
    const url = to && typeof to === 'object'
      ? `${to.pathname || '/'}${to.search || ''}${to.hash || ''}`
      : to;
    if (replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  }, [to, replace, router]);
  return null;
}

export function BrowserRouter({ children }) {
  return <>{children}</>;
}

export function Routes({ children }) {
  return <>{children}</>;
}

export function Route({ element }) {
  return <>{element}</>;
}
