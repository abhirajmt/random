import React from "react";
import Link from "next/link";

const Nav = () => (
  <nav>
    Nav from SSR B
    <ul>
      <li>
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/p/something">Federated Catch All</Link>
        <Link href="/checkout">Checkout</Link>
      </li>
    </ul>
  </nav>
);

export default Nav;
