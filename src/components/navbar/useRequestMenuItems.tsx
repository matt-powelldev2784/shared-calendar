import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Bell } from 'lucide-react';
import getEntryRequests from '@/db/request/getEntryRequests';

export const useRequestMenuItems = () => {
  const [numberOfRequests, setNumberOfRequests] = useState(0);

  const { data: requests } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const requests = await getEntryRequests();
      setNumberOfRequests(requests.length); 
      return requests;
    },
    refetchInterval: 60 * 0.5 * 1000, // 30 seconds
  });

  const requestMenuItems = requests
    ? requests.map((request) => ({
        id: request.id,
        text: 'Calendar entry request',
        description: request.message,
        icon: <Bell className="h-6 w-6" />,
        route: `/review-pending-entry?entryId=${request.entryId}&requestId=${request.id}`,
        notificationCount: numberOfRequests,
      }))
    : [];

  return { requestMenuItems, numberOfRequests };
};