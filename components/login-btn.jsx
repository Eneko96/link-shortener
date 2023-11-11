import { Button } from "../components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import utilStyles from "../styles/utils.module.css";

export default function AuthBtn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <Button className={utilStyles.login} onClick={() => signOut()}>
        Sign out
      </Button>
    );
  }
  return (
    <Button className={utilStyles.login} onClick={() => signIn()}>
      Sign in
    </Button>
  );
}
