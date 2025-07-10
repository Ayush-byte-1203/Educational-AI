
"use client";

import { useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';
import { BrainCircuit } from 'lucide-react';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <BrainCircuit className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            Classroom AI Companion
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLoginView ? "Welcome back! Please sign in to continue." : "Create an account to get started."}
          </p>
        </div>
        
        {isLoginView ? <LoginForm /> : <SignupForm />}

        <p className="text-center text-sm text-muted-foreground">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={toggleView} className="font-semibold text-primary hover:underline focus:outline-none">
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
