import fetch from 'node-fetch';

const SUPABASE_URL = 'https://wijodfkyfwdodwsqnmrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpam9kZmt5Zndkb2R3c3FubXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzY1MjgsImV4cCI6MjA3NzUxMjUyOH0.2ontW2JrSq1udQL9heCwErTb3e2fwZbejYYpfJYDyss';

export default async () => {
  try {
    // Requête GET pour “réveiller” la DB Supabase
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) throw new Error('Erreur ping Supabase: ' + res.statusText);
    return new Response('Ping Supabase OK ✅');
  } catch (err) {
    return new Response('Ping échoué ❌: ' + err.message, { status: 500 });
  }
};
