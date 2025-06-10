# Clerk Authentication Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication Configuration
# Get these values from your Clerk Dashboard (https://dashboard.clerk.com)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Custom URLs for Clerk (if you want to customize the auth flow)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/admin
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/admin
```

## Getting Started

1. **Create a Clerk Account**: Go to [https://dashboard.clerk.com](https://dashboard.clerk.com) and create an account.

2. **Create a New Application**: In your Clerk dashboard, create a new application.

3. **Get Your Keys**: Copy the Publishable Key and Secret Key from your Clerk dashboard.

4. **Set Environment Variables**: Add the keys to your `.env.local` file.

## Admin Panel Access

### Authentication Flow

- **Unauthenticated users** accessing `/admin` will be redirected to `/sign-in`
- **After signing in**, users will be redirected back to `/admin`
- **Authenticated users** can access the admin panel directly

### Components Created

- `/sign-in` - Custom sign-in page with Clerk authentication
- `/sign-up` - Custom sign-up page for new admin users
- `AdminLogin` component - Smart component that shows "Admin Login" or "Admin Panel" based on auth status
- Admin sidebar with user welcome message and sign-out functionality

### Security Features

- Middleware protection for all `/admin/*` routes
- Server-side authentication checks in admin layout
- Automatic redirects for unauthenticated users

## Usage Examples

### Adding Admin Login to Navigation

```tsx
import AdminLogin from "@/components/AdminLogin";

// In your navigation component
<AdminLogin />
```

### Using the SignIn Component with Redirect

```tsx
import SignIn from "@/components/SignIn";

// For redirect mode instead of modal
<SignIn mode="redirect" redirectUrl="/admin" />
```

## Next Steps

- Configure user roles in Clerk dashboard if needed
- Set up email templates for authentication flows
- Add role-based access control (uncomment code in admin layout) 