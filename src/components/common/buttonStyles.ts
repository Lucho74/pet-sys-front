const BASE =
  'cursor-pointer rounded-xl px-5 py-[13px] text-center text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed lg:py-[11px] lg:text-[14px]';

// #536FBA es el azul del logo: el único acento, reservado para la acción principal.
export const PRIMARY_BUTTON_CLASSES = `${BASE} bg-[#536FBA] text-white hover:bg-[#435FA9] focus-visible:ring-[#536FBA] disabled:opacity-70`;

export const SECONDARY_BUTTON_CLASSES = `${BASE} border border-[#9DB2BF] bg-white text-[#27374D] hover:border-[#27374D] focus-visible:ring-[#536FBA] disabled:opacity-60`;

export const GHOST_BUTTON_CLASSES =
  'cursor-pointer rounded-xl px-4 py-[13px] text-center text-[14px] font-semibold text-[#526D82] transition-colors hover:bg-[#DDE6ED] hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#536FBA] focus-visible:ring-offset-2';
