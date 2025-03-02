import { CalendarNavigation } from "@/components/calendar/calendarNavigation";
import { createFileRoute } from "@tanstack/react-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { useEffect } from "react";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

export const getTestRecords = async () => {
  try {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return null;
    }

    const userDoc = doc(db, "users", auth.currentUser.uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      console.error("The user is not sharing calendars with other users");
      return null;
    }

    const sharedUsers = userSnapshot.data().sharedCalendarUsers;

    if (!sharedUsers || !sharedUsers.length) {
      console.log("No shared users exist");
      return null;
    }

    const fetchSharedCalendars = sharedUsers.map(async (sharedUser: string) => {
      const sharedUserDoc = doc(db, "users", sharedUser);
      const sharedUserSnapshot = await getDoc(sharedUserDoc);

      if (!sharedUserSnapshot.exists()) {
        console.error("Shared user document does not exist");
        throw new Error(
          "Error fetching shared user document. Document does not exist",
        );
      }

      return sharedUserSnapshot.data();
    });

    const sharedCalendars = await Promise.all(fetchSharedCalendars);
    console.log("sharedCalendars", sharedCalendars);

    return sharedCalendars;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return null;
  }
};

function CalendarPage() {
  useEffect(() => {
    const fetchRecords = async () => {
      await getTestRecords();
    };
    fetchRecords();
  }, []);

  return <CalendarNavigation />;
}
