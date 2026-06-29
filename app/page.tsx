import { Button } from "@/components/ui/button";
import {handleUserOnboarding} from "@/modules/auth/actions"
import {UserButton} from "@clerk/nextjs"
export default async function Home() {

  await handleUserOnboarding()

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <UserButton />
    </div>
  );
}
