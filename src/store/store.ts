import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

type Calendars = {
  numberOfRequests: number;
  defaultCalendarId: string;
};

export const store = new Store<Calendars>({
  numberOfRequests: 0,
  defaultCalendarId: '',
});

export const setNumberOfRequests = (numberOfRequests: number) => {
  store.setState((state) => {
    return { ...state, numberOfRequests };
  });
};

export const getNumberOfRequests = () => {
  return useStore(store, (state) => state.numberOfRequests);
};

export const setDefaultCalendarId = (defaultCalendarId: string) => {
  store.setState((state) => {
    return { ...state, defaultCalendarId };
  });
};

export const getDefaultCalendarId = () => {
  return useStore(store, (state) => state.defaultCalendarId);
};
