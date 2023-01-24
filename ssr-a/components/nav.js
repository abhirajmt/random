import React from "react";
import Link from "next/link";

const Nav = () => (
  <nav>
    Nav from SSR A
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/about">About</Link>
      </li>
      <li>
        <Link href="/joke">Joke</Link>
      </li>
    </ul>
  </nav>
);

export default Nav;
