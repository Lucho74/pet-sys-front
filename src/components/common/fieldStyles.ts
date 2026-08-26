export const FIELD_LABEL_CLASSES =
  'text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]';

const BASE_CONTROL_CLASSES =
  'w-full rounded-xl border bg-white text-[15px] text-[#27374D] outline-none transition-colors placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 lg:text-[14px]';

const VALID_CLASSES = 'border-[#9DB2BF] focus:border-[#27374D] focus:ring-[#27374D]/25';

const INVALID_CLASSES = 'border-[#c0392b] focus:border-[#c0392b] focus:ring-[#c0392b]/25';

export function controlClasses(hasError: boolean, padding = 'px-[14px] py-[13px] lg:py-[11px]') {
  return `${BASE_CONTROL_CLASSES} ${padding} ${hasError ? INVALID_CLASSES : VALID_CLASSES}`;
}

export const FIELD_ERROR_CLASSES = 'text-[12px] leading-4 text-[#c0392b]';

export const FIELD_HINT_CLASSES = 'text-[12px] leading-4 text-[#526D82]';
