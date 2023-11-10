import { useSession, signIn, signOut } from "next-auth/react";
import utilStyles from "../styles/utils.module.css";

export default function AuthBtn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <button className={utilStyles.login} onClick={() => signOut()}>
        Sign out
      </button>
    );
  }
  return (
    <button className={utilStyles.login} onClick={() => signIn()}>
      Sign in
    </button>
  );
}
