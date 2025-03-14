import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import type { Calendar } from '@/ts/Calendar';

type Calendars = {
  calendars: Calendar[];
};

export const store = new Store<Calendars>({
  calendars: [],
});

export const addCalendarsToStore = (calenders: Calendar[]) => {
  store.setState((state) => {
    return { calenders, ...state };
  });
};

export const getCalendarsFromStore = () => {
  return useStore(store, (state) => state.calendars);
};
