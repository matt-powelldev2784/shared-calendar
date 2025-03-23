import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

type Calendars = {
  numberOfRequests: number;
};

export const store = new Store<Calendars>({
  numberOfRequests: 0,
});

export const setNumberOfRequests = (numberOfRequests: number) => {
  store.setState((state) => {
    return { ...state, numberOfRequests };
  });
};

export const getNumberOfRequests = () => {
  return useStore(store, (state) => state.numberOfRequests);
};
