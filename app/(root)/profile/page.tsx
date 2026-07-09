import { getCurrentUserData } from "@/lib/data/user"
import { SubmissionHistory } from "@/modules/problems/component/submission-history"
import PlaylistsSection from "@/modules/profile/components/playlists-section"
import ProfileStats from "@/modules/profile/components/profile-stats"
import SolvedProblems from "@/modules/profile/components/solved-problems"
import UserInfoCard from "@/modules/profile/components/user-info-card"
import { redirect } from "next/navigation"

async function ProfilePage() {
    const profileData = await getCurrentUserData()
    
    if (!profileData) {
        redirect("/")
    }

  return (
    <div className='min-h-screen py-32'>
        <div className='container mx-auto px-4 max-w-7xl'>
            <UserInfoCard userData={profileData}/>

            <ProfileStats
              submissions={profileData.submissions || []}
              solvedCount={profileData.solvedProblems?.length || 0}
              playlistCount={profileData.playlists?.length || 0}
            />

            <SubmissionHistory submissions={profileData.submissions || []}/>

            <div className='grid gap-8'>
              <SolvedProblems solvedProblems={profileData.solvedProblems || []}/>
              <PlaylistsSection playlists={profileData.playlists || []} />
            </div>
        </div>
    </div>
  )
}

export default ProfilePage