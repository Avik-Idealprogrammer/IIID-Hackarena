-- Insert sample game rooms
INSERT INTO public.game_rooms (title, description, game, entry_fee, max_players, start_date, start_time, difficulty, rules, host_id) VALUES
('Battle Royale Championship', 'Epic Fortnite tournament with massive prizes', 'Fortnite', 25.00, 20, '2024-02-15', '20:00:00', 'Expert', 'No teaming, no stream sniping', (SELECT id FROM public.profiles LIMIT 1)),
('CS2 Tournament', 'Competitive Counter-Strike 2 matches', 'Counter-Strike 2', 15.00, 16, '2024-02-16', '18:30:00', 'Intermediate', 'Standard competitive rules', (SELECT id FROM public.profiles LIMIT 1)),
('Rocket League 3v3', 'Fast-paced car soccer action', 'Rocket League', 10.00, 6, '2024-02-15', '19:00:00', 'Beginner', 'Fair play only', (SELECT id FROM public.profiles LIMIT 1));
