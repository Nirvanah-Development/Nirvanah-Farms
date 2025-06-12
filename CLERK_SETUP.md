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

## Admin Access Control

### Setting Up Admin Role in Clerk Dashboard

1. **Go to Clerk Dashboard** → **User & Authentication** → **Roles**
2. **Create "admin" role** if it doesn't exist
3. **Go to Users** → Select your admin user → **Public metadata**
4. **Add role metadata**:
   ```json
   {
     "role": "admin"
   }
   ```

### Disable Public Sign-Up (Recommended)

1. **Go to Clerk Dashboard** → **User & Authentication** → **Restrictions**
2. **Disable "Allow sign-ups"**
3. This prevents unauthorized users from creating accounts

### Alternative: Email Whitelist Approach

If you prefer email-based access control, edit `lib/admin-utils.ts`:

```typescript
const ADMIN_EMAILS = [
  "your-admin@email.com",
  "another-admin@email.com"
];

// Change the checkAdminAccess function to use email approach
export async function checkAdminAccess(): Promise<boolean> {
  return await checkAdminEmail();
}
```

### Security Features Implemented

- **Role-based access control** - Only users with "admin" role can access
- **Server-side validation** - All admin routes and actions are protected
- **Unauthorized page** - Non-admin users are redirected to `/unauthorized`
- **Smart navigation** - Admin links only show for authorized users

## Next Steps

- Set up your admin role in Clerk dashboard (see above)
- Test the admin access with your admin user
- Invite additional admin users through Clerk dashboard if needed 