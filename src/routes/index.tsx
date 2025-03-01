import { CalendarNavigation } from "@/components/calendar/calendarNavigation";
import { createFileRoute } from "@tanstack/react-router";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { useEffect } from "react";
import { SignIn } from "@/components/auth/signIn";
import { SignOut } from "@/components/auth/signOut";
import { add } from "date-fns";

export const Route = createFileRoute("/")({
  component: App,
});

export const addTestRecord = async () => {
  try {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    const userDoc = doc(db, "users", auth.currentUser.uid);
    const testCollection = collection(userDoc, "test");

    const docRef = await addDoc(testCollection, {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getTestRecords = async () => {
  try {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return [];
    }

    const userDoc = doc(db, "users", auth.currentUser.uid);
    const testCollection = collection(userDoc, "test");

    const querySnapshot = await getDocs(testCollection);
    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("records", records);

    return records;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

function App() {
  useEffect(() => {
    const addRecord = async () => {
      await addTestRecord();
      await getTestRecords();
    };
    addRecord();
  }, []);

  return (
    <>
      <CalendarNavigation />
      <SignIn />
      <SignOut />
    </>
  );
}
