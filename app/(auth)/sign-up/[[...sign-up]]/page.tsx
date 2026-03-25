import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-2xl",
              headerTitle: "text-slate-900 dark:text-slate-100 font-bold",
              headerSubtitle: "text-slate-600 dark:text-slate-400",
              socialButtonsBlockButton:
                "border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700",
              formFieldInput:
                "border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100",
              formButtonPrimary:
                "bg-blue-700 hover:bg-blue-800 text-white font-semibold",
              footerActionLink: "text-blue-700 hover:text-blue-800 font-medium",
            },
          }}
        />
      </div>
    </main>
  );
}
