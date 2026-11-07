const BASE =
  'cursor-pointer rounded-xl px-4 py-[14px] text-center text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed';

export const PRIMARY_BUTTON_CLASSES = `${BASE} bg-[#27374D] text-[#DDE6ED] hover:bg-[#1d2b3d] focus-visible:ring-[#27374D] disabled:opacity-70 lg:py-[11px] lg:text-[14px]`;

export const SECONDARY_BUTTON_CLASSES = `${BASE} border border-[#526D82] text-[#526D82] hover:bg-[#27374D]/10 hover:text-[#27374D] focus-visible:ring-[#27374D] disabled:opacity-60 lg:py-[11px] lg:text-[14px]`;

export const GHOST_BUTTON_CLASSES =
  'cursor-pointer rounded-xl px-4 py-[14px] text-center text-[14px] text-[#526D82] transition-colors hover:bg-[#27374D]/10 hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2';
