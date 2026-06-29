"use server";

import { prisma } from "@/lib/db";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const handleUserOnboarding = async () => {
    try{
  const user = await currentUser();
  if (!user){
    return {error: 'no user found '}
  };

 const {id,emailAddresses,firstName,lastName,imageUrl} =user

 const newUser = await prisma.user.upsert({
    where:{clerkId:id},
    create:{
        clerkId:id,
        email:emailAddresses[0].emailAddress,
        firstName,
        lastName,
        imageUrl,
    },
    update:{
        email:emailAddresses[0].emailAddress,
        firstName,
        lastName,
        imageUrl,
    }
 })
    }catch(e){
        return {error: 'failed to create user'}
    }
};
