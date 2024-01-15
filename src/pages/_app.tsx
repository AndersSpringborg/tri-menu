import { type AppType } from "next/app";
import { Poppins } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const poppins = Poppins({
  weight: "400",
  preload: true,
  variable: "--font-poppins",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
