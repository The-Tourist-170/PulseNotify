INSERT INTO teams (name) VALUES ('Engineering'), ('Marketing'), ('Support') ON CONFLICT (name) DO NOTHING;

INSERT INTO users (name, team_id, password, role) VALUES
('Alice', 1, '$2a$12$0gx.Z.zxNZcRUZ3f.u7JUeObxT36K3XlUPWMueJv8ESIiPVthujzK', 'ADMIN'),
('Bob', 1, '$2a$12$0gx.Z.zxNZcRUZ3f.u7JUeObxT36K3XlUPWMueJv8ESIiPVthujzK', 'USER'),
('Charlie', 2, '$2a$12$0gx.Z.zxNZcRUZ3f.u7JUeObxT36K3XlUPWMueJv8ESIiPVthujzK', 'USER'),
('Draco', 3, '$2a$12$0gx.Z.zxNZcRUZ3f.u7JUeObxT36K3XlUPWMueJv8ESIiPVthujzK', 'USER')
ON CONFLICT (name) DO NOTHING;