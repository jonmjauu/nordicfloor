import { CartProvider } from "./cart-provider";
import { Footer } from "./footer";
import { Header } from "./header";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
