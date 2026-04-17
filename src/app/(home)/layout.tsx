import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <HomeHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
      <HomeFooter />
    </div>
  );
}
