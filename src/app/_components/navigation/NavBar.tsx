import Link from "next/link";
import React from "react";
import "./NavBar.scss";
import { Text } from "@mantine/core";

const navLinks = [
  { title: "Home", url: "/pages/home" },
  { title: "Calendar", url: "/pages/calendar" },
  { title: "Search", url: "/pages/search" }
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