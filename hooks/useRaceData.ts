import { useEffect, useState } from 'react';
import localRaces from '../data/races.json';
import { AppEvents } from '../services/eventService';

interface Race {
  time: string;
  place: string;
  details: string;
  runners: number;
}

const getRaceId = (race: Race) => `${race.time}-${race.place}`;

export function useRaceData(currentTime: Date) {
  const [allRaces, setAllRaces] = useState<Race[] | null>(null);
  const [displayedRaces, setDisplayedRaces] = useState<Race[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch('https://www.pluckier.co.uk/races.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const remoteRaces = await response.json();
        setAllRaces(remoteRaces);
        console.log('Successfully fetched remote race data.');
      } catch (error) {
        console.error('Failed to fetch remote races, falling back to local data:', error);
        setAllRaces(localRaces as Race[]);
      }
    };
    void fetchRaces();
  }, []);

  useEffect(() => {
    if (!allRaces) return;

    const upcomingRaces = allRaces.filter((race) => {
      const raceDateTime = new Date();
      raceDateTime.setHours(...race.time.split(':').map(Number), 0, 0);
      return raceDateTime >= currentTime;
    });

    const displayedRaceIds = new Set(upcomingRaces.map(getRaceId));
    displayedRaces.forEach(race => {
      if (!displayedRaceIds.has(getRaceId(race))) {
        AppEvents.emit('closeAlert', { raceId: getRaceId(race) });
      }
    });
    setDisplayedRaces(upcomingRaces);
  }, [currentTime, allRaces]);

  return { raceData: allRaces, displayedRaces };
}
