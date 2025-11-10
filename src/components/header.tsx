import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 flex h-16 items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Simulador Firewall</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
