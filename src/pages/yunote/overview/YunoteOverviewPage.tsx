import { YunoteOverview } from '../../../widgets/yunote-overview';
import { activity, folders, heatmap, todayFocusTasks } from './mock';

export function YunoteOverviewPage() {
  // Позже здесь будет логика загрузки с API:
  // const { data, isLoading } = useGetOverviewQuery();

  const mockStats = {
    timeTracked: '3h 40m',
    tasksDone: '1 / 4',
    focusScore: '74%'
  };

  return (
    <YunoteOverview 
      tasks={todayFocusTasks}
      folders={folders}
      activity={activity}
      heatmap={heatmap}
      todayStats={mockStats}
    />
  );
}