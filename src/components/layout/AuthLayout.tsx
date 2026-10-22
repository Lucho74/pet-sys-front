import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#DDE6ED] font-sans">
      <header className="flex h-[90px] items-center justify-center bg-[#27374D]">
        <img
          src="/4patas-logo-azul.png"
          alt="4 Patas"
          className="h-[100px] w-auto object-contain"
        />
      </header>

      <main className="flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-10">
        {children}
      </main>
    </div>
  );
}