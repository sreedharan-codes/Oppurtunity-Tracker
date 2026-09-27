export function getDaysRemaining(deadlineDateStr: string): number {
  if (!deadlineDateStr) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineDateStr);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDeadline(deadlineDateStr: string): string {
  if (!deadlineDateStr) return 'No deadline';
  const date = new Date(deadlineDateStr);
  if (isNaN(date.getTime())) return deadlineDateStr;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export interface DeadlineIndicator {
  label: string;
  days: number;
  urgency: 'critical' | 'warning' | 'normal' | 'expired';
  isUrgent: boolean;
}

export function getDeadlineInfo(deadlineDateStr: string): DeadlineIndicator {
  const days = getDaysRemaining(deadlineDateStr);

  if (days < 0) {
    return {
      label: 'Expired',
      days,
      urgency: 'expired',
      isUrgent: false,
    };
  }

  if (days === 0) {
    return {
      label: 'Due today',
      days: 0,
      urgency: 'critical',
      isUrgent: true,
    };
  }

  if (days === 1) {
    return {
      label: 'Tomorrow',
      days: 1,
      urgency: 'critical',
      isUrgent: true,
    };
  }

  if (days <= 3) {
    return {
      label: `${days} days left`,
      days,
      urgency: 'critical',
      isUrgent: true,
    };
  }

  if (days <= 7) {
    return {
      label: `${days} days left`,
      days,
      urgency: 'warning',
      isUrgent: true,
    };
  }

  return {
    label: `${days} days left`,
    days,
    urgency: 'normal',
    isUrgent: false,
  };
}

export function isDeadlineWithinDays(deadlineDateStr: string, maxDays: number): boolean {
  const days = getDaysRemaining(deadlineDateStr);
  return days >= 0 && days <= maxDays;
}
