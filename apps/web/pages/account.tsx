import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

export default function Review() {
  return (
    <Button onClick={() => signOut()}>Sign out</Button>
  )
}
