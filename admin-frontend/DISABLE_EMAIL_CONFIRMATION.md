# Disable Email Confirmation (For Development)

The 400 error with "email_not_confirmed" means Supabase requires users to confirm their email before signing in.

## Quick Fix: Disable Email Confirmation

1. Go to: https://supabase.com/dashboard/project/iovqkwkezewofswnglnx/auth/providers
2. Scroll down to **Email** provider
3. Find **"Confirm email"** toggle
4. **Turn it OFF**
5. Click **Save**

Now users can sign in immediately after signing up without email confirmation.

## Alternative: Keep Email Confirmation

If you want to keep email confirmation enabled, you'll need to:
1. Check email for confirmation link after signup
2. Handle the confirmation flow in your app
3. Only redirect to dashboard after email is confirmed

For development/demo purposes, disabling it is usually easier.

