import React from "react";
import Link from "next/link";

import { Button, Space } from "antd";

// import Modal from "@mindtickle/modal";
// import Button from "@mindtickle/button/lib/PrimaryButton";

const Nav = () => {
  console.count("ssb-nav");

  return (
    <nav>
      Nav from SSR B
      {/* <Button onClick={() => showLogoutAlert()}>Open Modal</Button> */}
      <Space wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
      </Space>
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
};
export default Nav;

// const showLogoutAlert = () => {
//   Modal.confirm({
//     title: "ergergergerg",
//     content: "ergrege",
//     closable: false,
//     width: 400,
//     footerBtnProps: {
//       okButtonProps: {
//         type: "primary",
//         size: "medium"
//       }
//     },
//     okButtonText: "OK",
//     onOk: () => alert(23)
//   });
// };
