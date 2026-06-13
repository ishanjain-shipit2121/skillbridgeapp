import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) console.error('getProfile error:', error);
  return data;
}

export async function upsertProfile(profile: {
  id: string;
  name?: string;
  target_role?: string;
  roadmap_progress?: number;
  dsa_solved?: number;
  streak_days?: number;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .maybeSingle();
  if (error) console.error('upsertProfile error:', error);
  return data;
}

export async function saveRoadmap(roadmap: {
  user_id: string;
  quiz_answers: any;
  skill_gaps: string[];
  weeks: any[];
  saved: boolean;
}) {
  const { data, error } = await supabase
    .from('roadmaps')
    .insert(roadmap)
    .select()
    .maybeSingle();
  if (error) console.error('saveRoadmap error:', error);
  return data;
}

export async function getRoadmaps(userId: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) console.error('getRoadmaps error:', error);
  return data;
}

export async function saveChatMessage(message: {
  user_id: string;
  text: string;
  is_user: boolean;
}) {
  const { error } = await supabase
    .from('chat_messages')
    .insert(message);
  if (error) console.error('saveChatMessage error:', error);
}

export async function getChatMessages(userId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(50);
  if (error) console.error('getChatMessages error:', error);
  return data;
}
