import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/schedule/styles.css";
import type { Metadata } from "next";
import NavBar from "./_components/navigation/NavBar";
import "./styles.scss";

export const metadata: Metadata = {
  title: "Motorsports Cal"
};

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <MantineProvider theme={theme}>
            <NavBar />
            {children}
          </MantineProvider>
        </div>
      </body>
    </html >
  );
}
