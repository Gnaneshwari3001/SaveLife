import Header from "./Header";
import Footer from "./Footer";
import FloatingDonateButton from "./FloatingDonateButton";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <FloatingDonateButton />
      <Footer />
    </div>
  );
}
