export type UserSettings = {
  nickname: string;
  accentColor: string;
  presets: string[];
  statistics: {
    tasksDone: number;
    timeTracked: string;
    daysLogged: number;
    streak: string;
  };
};
