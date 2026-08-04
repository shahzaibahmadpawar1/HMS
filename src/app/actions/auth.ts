'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  // Check against our custom users table
  const { data, error } = await supabase
    .from('users')
    .select('id, username, password_plain')
    .eq('username', username)
    .single();

  if (error || !data) {
    return { error: 'Invalid username or password' };
  }

  if (data.password_plain !== password) {
    return { error: 'Invalid username or password' };
  }

  // Create a simple session cookie
  // In a real app, you'd use a signed JWT here.
  const sessionData = {
    userId: data.id,
    username: data.username,
  };

  const cookieStore = await cookies();
  cookieStore.set('hms_session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('hms_session');
  redirect('/login');
}
