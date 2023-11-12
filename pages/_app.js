import "../styles/global.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/theme-provider";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
