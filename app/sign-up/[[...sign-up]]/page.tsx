import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get access to the Nirvanah MS admin dashboard
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-[#2c5a3f] hover:bg-[#1e3f2a] text-white",
                card: "shadow-lg",
                headerTitle: "hidden",
                headerSubtitle: "hidden"
              }
            }}
            redirectUrl="/admin"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
} 