import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'mpbudxo4',
  dataset: 'productions',
  useCdn: false, // Ensures we get fresh data immediately
  apiVersion: '2024-04-02', 
  token: import.meta.env.VITE_SANITY_TOKEN || '', 
  // Required in Vite React app for executing write/delete commands securely
});
