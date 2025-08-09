"use client";

import { redirect } from 'next/navigation';

// Redirect to login page since we handle both login and register there
export default function RegisterPage() {
  redirect('/login');
}