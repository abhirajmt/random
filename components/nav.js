import React from 'react';
import Link from 'next/link';
const links = [
  { href: '/csr', label: 'CSR' },
  { href: '/ssr', label: 'SSR' },
  { href: '/other', label: 'Other' },
  { href: '/dynamic', label: 'Dynamic' },
  { href: '/dashboard', label: 'Dashboard' },
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        {links.map(({ key, href, label }) => (
          <li key={key}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Helvetica, sans-serif;
        }
        nav {
          text-align: center;
        }
        ul {
          display: flex;
          justify-content: space-between;
        }
        nav > ul {
          padding: 4px 16px;
        }
        li {
          display: flex;
          padding: 6px 8px;
        }
        a {
          color: #067df7;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>
    </nav>
  );
};

export default Nav;
