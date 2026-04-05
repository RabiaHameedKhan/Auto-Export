-- Fresh database only. Run: psql $DATABASE_URL -f scripts/seed-sample.sql
-- Login: admin@example.com / changeme

INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'admin@example.com',
  '$2b$10$Xp/4wzISNqbXsksdAjYJg.ki3WPwZmtaL6wBnrkUeoVs1OFc6foua',
  'Admin'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO makes (name, slug, is_active) VALUES
  ('Toyota', 'toyota', true),
  ('Ford', 'ford', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO body_types (name, slug) VALUES
  ('Double Cab', 'double-cab'),
  ('SUV', 'suv')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO models (make_id, name, slug, is_active)
SELECT m.id, 'Hilux', 'hilux', true FROM makes m WHERE m.slug = 'toyota' LIMIT 1;
INSERT INTO models (make_id, name, slug, is_active)
SELECT m.id, 'Ranger', 'ranger', true FROM makes m WHERE m.slug = 'ford' LIMIT 1;

INSERT INTO vehicles (
  stock_number, make_id, model_id, body_type_id, title, year, price, mileage,
  fuel_type, transmission, steering, condition, description, is_active, is_featured
)
SELECT
  'DEMO-001',
  m.id,
  mo.id,
  bt.id,
  '2020 TOYOTA HILUX DOUBLE CAB',
  2020,
  18500.00,
  45000,
  'Diesel',
  'Automatic',
  'Right',
  'used',
  '<p>Demo vehicle for the export storefront.</p>',
  true,
  true
FROM makes m
JOIN models mo ON mo.make_id = m.id AND mo.slug = 'hilux'
JOIN body_types bt ON bt.slug = 'double-cab'
WHERE m.slug = 'toyota'
LIMIT 1;

INSERT INTO vehicle_images (vehicle_id, url, sort_order, is_primary)
SELECT v.id, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80', 0, true
FROM vehicles v WHERE v.stock_number = 'DEMO-001';

INSERT INTO site_settings (key, value) VALUES
  ('company_name', 'Auto Export'),
  ('phone', '+66 00 000 0000'),
  ('whatsapp', '66000000000'),
  ('email', 'info@example.com'),
  ('address', 'Bangkok, Thailand')
ON CONFLICT (key) DO NOTHING;
