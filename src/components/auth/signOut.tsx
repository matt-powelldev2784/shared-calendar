import { signOut as signoutFirebase } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export const signOut = async () => {
  try {
    await signoutFirebase(auth);
    console.log("User signed out successfully");
  } catch (e) {
    console.error("Error signing out: ", e);
  }
};

export const SignOut = () => {
  return (
    <div className="mt-4 flex flex-row gap-2">
      <button
        type="button"
        data-te-ripple-init
        data-te-ripple-color="light"
        className="mb-2 flex rounded px-6 py-2.5 text-xs leading-normal font-medium text-white uppercase shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:ring-0 focus:outline-none active:shadow-lg"
        style={{ backgroundColor: "#ea4335" }}
        onClick={signOut}
      >
        Sign Out
      </button>
    </div>
  );
};
