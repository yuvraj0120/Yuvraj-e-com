type ProfileData = {
  name: string
  role: string
  email: string
  joined: string
  bio: string
}

export function ProfileCard({ profile }: { profile: ProfileData }) {
  return (
    <section className="rounded-xl border bg-card p-6 text-card-foreground">
      <h2 className="text-lg font-semibold">Profile Details</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Name</p>
          <p className="font-medium">{profile.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Role</p>
          <p className="font-medium">{profile.role}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="font-medium">{profile.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Joined</p>
          <p className="font-medium">{profile.joined}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{profile.bio}</p>
    </section>
  )
}
