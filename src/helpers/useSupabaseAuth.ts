import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (mounted) {
          setSession(data.session);
          setLoading(false);
        }
        return;
      }

      // No session → sign in anonymously
      const { data: signInData, error } =
        await supabase.auth.signInAnonymously();
      if (error) {
        console.error("Anonymous sign-in error", error);
      } else if (mounted && signInData.session) {
        setSession(signInData.session);
      }
      if (mounted) setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
