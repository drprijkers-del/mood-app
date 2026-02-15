import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900 px-4">
      <SignUp
        fallbackRedirectUrl="/teams"
        signInUrl="/sign-in"
      />
    </div>
  )
}
