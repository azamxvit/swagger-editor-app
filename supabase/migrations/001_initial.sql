-- User schemas table
CREATE TABLE IF NOT EXISTS user_schemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('json', 'yaml')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE user_schemas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own schema"
  ON user_schemas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schema"
  ON user_schemas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schema"
  ON user_schemas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own schema"
  ON user_schemas FOR DELETE
  USING (auth.uid() = user_id);

-- Request history table
CREATE TABLE IF NOT EXISTS request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  url TEXT NOT NULL,
  endpoint TEXT,
  request_size INTEGER NOT NULL DEFAULT 0,
  response_size INTEGER NOT NULL DEFAULT 0,
  status_code INTEGER,
  duration_ms INTEGER NOT NULL,
  error_details TEXT,
  request_headers JSONB DEFAULT '{}',
  request_body TEXT,
  response_headers JSONB DEFAULT '{}',
  response_body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS request_history_user_created_idx
  ON request_history (user_id, created_at DESC);

ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
  ON request_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON request_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
