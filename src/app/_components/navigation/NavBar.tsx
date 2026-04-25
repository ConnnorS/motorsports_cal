import Link from "next/link";
import React from "react";
import "./NavBar.scss";
import { Text } from "@mantine/core";

const navLinks = [
  { title: "Home", url: "/home" },
  { title: "Calendar", url: "/calendar" },
  { title: "Search", url: "/search" }
];

export default function NavBar(): React.JSX.Element {
  return (
    <div className="navBar">
      {Object.entries(navLinks).map(([key, value]) => (
        <Link className="nextLink" key={key} href={value.url}>
          <Text>{value.title}</Text>
        </Link>
      ))}
    </div>
  );
}