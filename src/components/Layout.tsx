import { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import StickyCTA from './StickyCTA';
import EntrancePopup from './EntrancePopup';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Nav />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <StickyCTA />
      <EntrancePopup />
    </div>
  );
}
