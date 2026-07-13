DROP POLICY IF EXISTS "Users can delete own history" ON request_history;

CREATE POLICY "Users can delete own history"
  ON request_history FOR DELETE
  USING (auth.uid() = user_id);
