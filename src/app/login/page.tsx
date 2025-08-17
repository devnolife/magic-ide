import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { WizardLogo } from '@/components/branding/WizardLogo';

export const metadata: Metadata = {
  title: 'Login | Python Learning Platform',
  description: 'Sign in to continue your Python learning journey',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo and Brand */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <WizardLogo className="h-12 w-12 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IDE Magic
            </h1>
          </div>
          <p className="text-muted-foreground">
            Interactive Python Learning Platform
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 IDE Magic. Built with Next.js and shadcn/ui.</p>
        </div>
      </div>
    </div>
  );
}
