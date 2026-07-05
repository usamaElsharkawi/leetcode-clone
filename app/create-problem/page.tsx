import { getCurrentUserData } from "@/lib/data/user";
import { Role } from "@/lib/generated/prisma/enums";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { CreateProblemForm } from "@/modules/problems/component/create-problem-form";

async function CreateProblemPage() {
  const user = await getCurrentUserData();
  if (user?.role !== Role.ADMIN) {
    redirect("/");
  }
  return (
     <section className='flex flex-col items-center justify-center  mx-4 my-4'>
        <div className='flex flex-row justify-between items-center w-full'>
            <Link href={"/"}>
            <Button variant={"outline"} size={"icon"}>
                <ArrowLeft className='size-4' />
            </Button>
            </Link>

             <h1 className='text-3xl font-bold text-(--amber-text-emphasis)'>Welcome {user?.firstName}! Create a Problem</h1>
        <ModeToggle/>
        </div>
       <CreateProblemForm/>
    </section>
  );
}

export default CreateProblemPage;
