import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@/components/auth/signIn";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <SignIn />
    </>
  );
}
