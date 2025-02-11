import { useMemo } from 'react';

type DateRangeType = '7d' | '30d';

interface UseDateRangeOptions {
  type: DateRangeType;
  showToday?: boolean;
}

export function useDateRange({ type, showToday = true }: UseDateRangeOptions) {
  return useMemo(() => {
    const days = [];
    const daysToShow = type === '7d' ? 7 : 30;
    const today = new Date();

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const isToday = date.toDateString() === today.toDateString();
      const formattedDate = date.toISOString().split('T')[0];

      days.push({
        date: formattedDate,
        display:
          showToday && isToday
            ? 'Today'
            : type === '7d'
              ? date.toLocaleDateString('en-US', { weekday: 'long' })
              : date.toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                }),
        isToday,
        fullDate: date.toLocaleDateString(),
      });
    }

    return days;
  }, [type, showToday]);
}
