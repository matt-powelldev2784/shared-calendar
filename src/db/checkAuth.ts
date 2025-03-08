import { CustomError } from "@/ts/errorClass";
import { getAuth } from "firebase/auth";

const checkAuth = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("User not authenticated");
    throw new CustomError(401, "User not authenticated");
  }

  return currentUser;
};

export default checkAuth;
