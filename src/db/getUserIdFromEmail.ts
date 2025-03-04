import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { CustomError } from "@/ts/errorClass";

export const getUserIdFromEmail = async (email: string) => {
  try {
    const publicUsersRef = collection(db, "publicUsers");
    const userIdQuery = query(publicUsersRef, where("email", "==", email));
    const userIdQuerySnapshot = await getDocs(userIdQuery);

    if (userIdQuerySnapshot.empty) {
      throw new CustomError(
        404,
        "No user found with the provided email address.",
      );
    }

    const userId = userIdQuerySnapshot.docs[0].data().userId;
    return userId;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      console.error("Error getting user ID from email: ", error);
      throw new CustomError(500, "Failed to get user ID from email");
    }
  }
};


