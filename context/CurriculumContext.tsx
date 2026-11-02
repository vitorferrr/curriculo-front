import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { api } from '@/services/api';
import type { FullProfile, Profile } from '@/types/curriculum';

const DEFAULT_PROFILE_NAME = 'Vitor Ferreira';

type CurriculumContextValue = {
  profiles: Profile[];
  curriculum: FullProfile | null;
  selectedProfileId: string | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  selectProfile: (profileId: string) => void;
  refresh: () => Promise<void>;
  retry: () => void;
};

const CurriculumContext = createContext<CurriculumContextValue | null>(null);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [curriculum, setCurriculum] = useState<FullProfile | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastRequest = useRef(0);

  const loadCurriculum = useCallback(async (profileId: string) => {
    const requestId = ++lastRequest.current;
    const data = await api.getFullProfile(profileId);
    if (requestId === lastRequest.current) setCurriculum(data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const list = await api.getProfiles();
      setProfiles(list);

      if (list.length === 0) {
        setCurriculum(null);
        setSelectedProfileId(null);
        return;
      }

      const initial =
        list.find((profile) => profile.id === selectedProfileId) ??
        list.find((profile) => profile.name === DEFAULT_PROFILE_NAME) ??
        list[0];

      setSelectedProfileId(initial.id);
      await loadCurriculum(initial.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }, [loadCurriculum, selectedProfileId]);

  useEffect(() => {
    loadAll();
  }, []);

  const selectProfile = useCallback(
    (profileId: string) => {
      if (profileId === selectedProfileId) return;

      setSelectedProfileId(profileId);
      setLoading(true);
      setError(null);

      loadCurriculum(profileId)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    },
    [loadCurriculum, selectedProfileId],
  );

  const refresh = useCallback(async () => {
    if (!selectedProfileId) return loadAll();

    setRefreshing(true);
    try {
      const [list] = await Promise.all([api.getProfiles(), loadCurriculum(selectedProfileId)]);
      setProfiles(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setRefreshing(false);
    }
  }, [loadAll, loadCurriculum, selectedProfileId]);

  const retry = useCallback(() => {
    loadAll();
  }, [loadAll]);

  return (
    <CurriculumContext.Provider
      value={{
        profiles,
        curriculum,
        selectedProfileId,
        loading,
        refreshing,
        error,
        selectProfile,
        refresh,
        retry,
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error('useCurriculum precisa estar dentro de <CurriculumProvider>.');
  }
  return context;
}