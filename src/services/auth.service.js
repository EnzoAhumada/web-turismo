import { supabase } from '../lib/supabase';

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error('Error al verificar la sesión activa.');
  return data?.session ?? null;
}

export function onAuthStateChange(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => listener?.subscription?.unsubscribe();
}

export async function getProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signUpWithEmail({ email, password, nombre, apellido }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre, apellido } },
  });
  return { data, error };
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}
