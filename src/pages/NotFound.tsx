import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { PRIMARY_BUTTON_CLASSES } from '../components/common/buttonStyles';

export function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-1 items-center justify-center bg-[#F4F7F9] px-6">
      <div className="w-full max-w-sm rounded-[24px] border border-[#E3E9EE] bg-white p-7 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EDF7]">
          <PawPrint size={26} strokeWidth={2.2} className="text-[#27374D]" aria-hidden="true" />
        </div>
        <div className="mt-4 text-[30px] font-extrabold text-[#27374D]">404</div>
        <div className="mt-1 text-[15px] text-[#526D82]">Por acá no hay ninguna huella. La página que buscás no existe.</div>
        <Link to="/" className={`mt-6 inline-flex w-full items-center justify-center ${PRIMARY_BUTTON_CLASSES}`}>
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
