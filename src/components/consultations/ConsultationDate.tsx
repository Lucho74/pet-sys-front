import { dayAndMonth } from '../../utils/datetime';

interface ConsultationDateProps {
  date: string;
  isDeleted?: boolean;
}

export function ConsultationDate({ date, isDeleted = false }: ConsultationDateProps) {
  const { day, month } = date ? dayAndMonth(date) : { day: '–', month: 'sin fecha' };

  return (
    <div
      className={`flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-[16px] border ${
        isDeleted ? 'border-[#9DB2BF] bg-white text-[#526D82]' : 'border-[#27374D] bg-[#27374D] text-white'
      }`}
    >
      <span className="text-[20px] font-extrabold leading-none">{day}</span>
      <span className="mt-0.5 text-[12px] leading-none">{month}</span>
    </div>
  );
}
