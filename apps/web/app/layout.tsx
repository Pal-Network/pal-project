import "./globals.css";
import { env } from "../src/env";

export const metadata = {
  title: "Pal Network",
  description: "Pal Network Web Client"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  void env;
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
