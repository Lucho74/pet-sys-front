import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F9] lg:flex-row">
      <aside className="flex flex-col items-center justify-center gap-5 px-6 pb-2 pt-10 lg:w-[44%] lg:bg-[#27374D] lg:p-12">
        <img
          src="/4patas-logo-azul.png"
          alt="4 Patas"
          className="h-[140px] w-[140px] rounded-[32px] bg-white object-contain p-2 lg:h-[220px] lg:w-[220px] lg:rounded-[44px]"
        />
        <p className="hidden max-w-[300px] text-center text-[17px] font-semibold leading-7 text-[#DDE6ED] lg:block">
          Las mascotas y sus consultas, en un solo lugar.
        </p>
      </aside>

      <main className="flex flex-1 items-start justify-center px-5 py-8 lg:items-center lg:py-10">
        {children}
      </main>
    </div>
  );
}
