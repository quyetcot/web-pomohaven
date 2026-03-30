-- ============================================================================
-- 003_personal_tracks.sql
-- Description: Store user's custom YouTube tracks for Aural Sanctuary
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.personal_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    yt_video_id TEXT NOT NULL,
    name TEXT NOT NULL,
    genre TEXT DEFAULT 'Personal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, yt_video_id)
);

-- RLS
ALTER TABLE public.personal_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own personal tracks" ON public.personal_tracks
    FOR ALL USING (auth.uid() = user_id);
