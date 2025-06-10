import { auth, currentUser } from "@clerk/nextjs/server";

// Admin emails whitelist (alternative approach)
const ADMIN_EMAILS = [
  // Add your admin emails here
  // "admin@yourdomain.com",
  "nirvanah550@gmail.com"
];

/**
 * Check if current user has admin access using role-based approach
 */
export async function checkAdminRole(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await currentUser();
    const userRole = user?.publicMetadata?.role;
    
    return userRole === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Check if current user has admin access using email whitelist approach
 */
export async function checkAdminEmail(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    
    return userEmail ? ADMIN_EMAILS.includes(userEmail) : false;
  } catch (error) {
    console.error("Error checking admin email:", error);
    return false;
  }
}

/**
 * Main admin access check function
 * Change this to use either role-based or email-based approach
 */
export async function checkAdminAccess(): Promise<boolean> {
  // Use role-based approach (recommended)
  return await checkAdminRole();
  
  // Alternative: Use email-based approach
  // return await checkAdminEmail();
  
  // Alternative: Use both approaches (either role OR email)
  // const hasRole = await checkAdminRole();
  // const hasEmail = await checkAdminEmail();
  // return hasRole || hasEmail;
}

/**
 * Get current user's admin status and info
 */
export async function getAdminUserInfo() {
  try {
    const { userId } = await auth();
    if (!userId) return { isAdmin: false, user: null };

    const user = await currentUser();
    const isAdmin = await checkAdminAccess();
    
    return { 
      isAdmin, 
      user,
      userRole: user?.publicMetadata?.role,
      userEmail: user?.emailAddresses[0]?.emailAddress
    };
  } catch (error) {
    console.error("Error getting admin user info:", error);
    return { isAdmin: false, user: null };
  }
} 