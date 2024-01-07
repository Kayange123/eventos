import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import ToastProvider from "@/providers/toast-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen ">
      <ToastProvider />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
