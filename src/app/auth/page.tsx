
"use client";

import { useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';
import { BrainCircuit } from 'lucide-react';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-background">
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 text-center bg-muted/40 h-full">
         <BrainCircuit className="w-24 h-24 text-primary" />
         <h1 className="mt-6 text-4xl lg:text-5xl font-bold font-headline text-primary">
            Classroom AI Companion
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-md">
            Your intelligent partner for a seamless and engaging learning experience.
          </p>
      </div>
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center mb-2">
            {isLoginView ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            {isLoginView ? "Sign in to access your dashboard." : "Let's get you started."}
          </p>
          
          {isLoginView ? <LoginForm /> : <SignupForm />}

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={toggleView} className="font-semibold text-primary hover:underline focus:outline-none">
              {isLoginView ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
