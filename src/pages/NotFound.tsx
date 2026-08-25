import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#DDE6ED] px-6 font-sans">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(39,55,77,0.06)]">
        <div className="text-[26px] font-bold tracking-[-0.3px] text-[#27374D]">404</div>
        <div className="mt-1 text-[14px] text-[#526D82]">La página que buscas no existe.</div>
        <Link
          to="/"
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#27374D] px-4 py-[14px] text-[15px] font-semibold text-[#DDE6ED]"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
