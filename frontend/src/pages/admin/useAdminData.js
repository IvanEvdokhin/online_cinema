import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../api/client';
import { formatDateKey } from '../../utils/seats';

export default function useAdminData(isAuthenticated) {
  const [halls, setHalls] = useState([]);
  const [movies, setMovies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [settings, setSettings] = useState({ sales_open: false });
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [selectedPriceHallId, setSelectedPriceHallId] = useState(null);
  const [selectedDate] = useState(new Date());

  const selectedHall = useMemo(
    () => halls.find((hall) => hall.id === selectedHallId) || halls[0],
    [halls, selectedHallId],
  );

  const selectedPriceHall = useMemo(
    () => halls.find((hall) => hall.id === selectedPriceHallId) || halls[0],
    [halls, selectedPriceHallId],
  );

  const loadData = useCallback(async () => {
    const [hallsResponse, moviesResponse, timelineResponse, settingsResponse] = await Promise.all([
      api.getHalls(),
      api.getMovies(),
      api.getSeancesTimeline(formatDateKey(selectedDate)),
      api.getSettings(),
    ]);

    setHalls(hallsResponse.data);
    setMovies(moviesResponse.data);
    setTimeline(timelineResponse.data);
    setSettings(settingsResponse.data);

    setSelectedHallId((prev) => prev ?? hallsResponse.data[0]?.id ?? null);
    setSelectedPriceHallId((prev) => prev ?? hallsResponse.data[0]?.id ?? null);
  }, [selectedDate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData().catch(console.error);
    }
  }, [isAuthenticated, loadData]);

  return {
    halls,
    movies,
    timeline,
    settings,
    setSettings,
    selectedHallId,
    setSelectedHallId,
    selectedPriceHallId,
    setSelectedPriceHallId,
    selectedHall,
    selectedPriceHall,
    selectedDate,
    loadData,
  };
}
