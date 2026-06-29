import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function getCurrentUserRole() {
  const { userId } = await auth()
  if (!userId) {
    return null
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true }
  })
  return user?.role
}

export async function getCurrentUserData() {
    
  const { userId } = await auth()
  if (!userId) {
    return null
  }
  return await prisma.user.findUnique({
    where: { clerkId: userId }
  })
}