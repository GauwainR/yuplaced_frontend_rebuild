export type RecentDay = {
  id: number;
  label: string;
  entries: number;
  active?: boolean;
};

export type TimeEntry = {
  label: string;
  duration: string;
};

export type NextTask = {
  id: number;
  title: string;
  suggested?: boolean;
};

export type DayReport = {
  recentDays: RecentDay[];
  stats: {
    timeTracked: string;
    tasksDone: number;
    daysLogged: number;
  };
  done: string[];
  value: string;
  time: {
    total: string;
    entries: TimeEntry[];
  };
  note: string;
  next: NextTask[];
};
