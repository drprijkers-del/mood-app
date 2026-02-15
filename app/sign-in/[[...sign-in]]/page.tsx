import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900 px-4">
      <SignIn
        fallbackRedirectUrl="/teams"
        signUpUrl="/sign-up"
      />
    </div>
  )
}
