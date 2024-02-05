import Link from 'next/link';
import React from 'react';

const NavLink = ({ children, href, ...props }: any) => (
  <Link
    href={href}
    {...props}
    className={`py-2.5 px-4 text-center rounded-lg duration-150 ${
      props?.className || ''
    }`}
  >
    {children}
  </Link>
);

export default NavLink;