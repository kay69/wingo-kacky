import { differenceInCalendarDays } from 'date-fns';

import { useCurrentSeason } from '@/hooks/useCurrentSeason';

import { ProgressCircle } from './ProgressCircle';

export function CurrentEditionCard() {
  const { data, isLoading } = useCurrentSeason();

  if (!data || isLoading) {
    return null;
  }

  const {
    season: { name, startAt, endAt, game },
  } = data;

  const totalDays = differenceInCalendarDays(
    new Date(endAt),
    new Date(startAt),
  );
  const remainingDays = differenceInCalendarDays(new Date(endAt), new Date());
  const progress = Math.round((remainingDays / totalDays) * 100);

  return (
    <div className="flex h-full flex-row items-end justify-between gap-2.5 rounded-2xl bg-theme-5 p-4">
      <div className="flex flex-col items-start justify-end gap-1">
        <div className="text-sm font-medium text-theme-3">En cours</div>
        <div className="text-lg font-bold text-theme-2">{name}</div>
        <div className="inline-flex items-start justify-start gap-2.5 rounded border border-theme-8 bg-theme-7 px-1 py-0.5 dark:border-theme-3">
          <div className="text-[10px] font-medium text-theme-2">{game}</div>
        </div>
      </div>
      <ProgressCircle progress={progress} displayed={remainingDays} />
    </div>
  );
}
