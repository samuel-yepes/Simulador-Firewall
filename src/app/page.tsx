import { Header } from "@/components/header";
import { FirewallSimClient } from "@/components/firewall-sim-client";
import { Suspense } from "react";
import Loading from "./loading";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<Loading />}>
          <FirewallSimClient />
        </Suspense>
      </main>
    </div>
  );
}
