/**
 * Seed dummy catalog + inventory. Requires DATABASE_URL in .env.local or .env.
 * Run: node scripts/seed-dummy.mjs
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import pg from "pg";

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const p = join(process.cwd(), f);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL in .env.local (see .env.example)");
  process.exit(1);
}

const imgs = [
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
];

const vehicles = [
  ["AE-1001", "toyota", "hilux", "double-cab", "2021 TOYOTA HILUX DOUBLE CAB 2.8", 2021, 6, 22400, 38000, "Diesel", "Automatic", "Right", 2755, "White", "4WD", "used", "<p>Well maintained, full service history.</p>", true, false],
  ["AE-1002", "ford", "ranger", "double-cab", "2022 FORD RANGER WILDTRAK", 2022, 3, 28900, 22000, "Diesel", "Automatic", "Right", 1996, "Grey", "4WD", "used", "<p>Top trim, leather, navigation.</p>", true, false],
  ["AE-1003", "toyota", "fortuner", "suv", "2020 TOYOTA FORTUNER 2.8", 2020, 11, 31500, 52000, "Diesel", "Automatic", "Right", 2755, "Silver", "4WD", "used", "<p>Clearance pricing â€” minor cosmetic wear.</p>", false, true],
  ["AE-1004", "mitsubishi", "triton", "double-cab", "2019 MITSUBISHI TRITON ATHLETE", 2019, 8, 16800, 78000, "Diesel", "Manual", "Right", 2442, "Black", "4WD", "used", "<p>Manual gearbox, strong runner.</p>", false, false],
  ["AE-1005", "isuzu", "d-max", "double-cab", "2023 ISUZU D-MAX V-CROSS", 2023, 2, 26200, 12000, "Diesel", "Automatic", "Right", 1898, "Red", "4WD", "brand_new", "<p>Brand new â€” delivery mileage only.</p>", true, false],
  ["AE-1006", "nissan", "navara", "double-cab", "2018 NISSAN NAVARA ST-X", 2018, 5, 14200, 95000, "Diesel", "Automatic", "Right", 2298, "White", "2WD", "used", "<p>Budget-friendly workhorse.</p>", false, false],
  ["AE-1007", "toyota", "hiace", "van", "2021 TOYOTA HIACE COMMUTER", 2021, 4, 19800, 41000, "Diesel", "Automatic", "Right", 2755, "White", "2WD", "used", "<p>15-seater, ideal for shuttle operators.</p>", false, false],
  ["AE-1008", "ford", "everest", "suv", "2022 FORD EVEREST SPORT", 2022, 9, 35200, 28000, "Diesel", "Automatic", "Right", 1996, "Blue", "4WD", "used", "<p>Panoramic roof, adaptive cruise.</p>", true, false],
  ["AE-1009", "honda", "cr-v", "suv", "2023 HONDA CR-V TURBO", 2023, 1, 30500, 8000, "Petrol", "Automatic", "Left", 1498, "Grey", "2WD", "used", "<p>LHD example for selected markets.</p>", true, false],
  ["AE-1010", "mitsubishi", "pajero-sport", "suv", "2020 MITSUBISHI PAJERO SPORT GT", 2020, 7, 23800, 61000, "Diesel", "Automatic", "Right", 2442, "Dark Grey", "4WD", "used", "<p>End of line clearance.</p>", false, true],
  ["AE-1011", "toyota", "hilux", "standard-cab", "2017 TOYOTA HILUX STANDARD CAB", 2017, 10, 11200, 120000, "Diesel", "Manual", "Right", 2393, "White", "2WD", "used", "<p>Fleet vehicle, high km, runs well.</p>", false, false],
  ["AE-1012", "toyota", "fortuner", "suv", "2024 TOYOTA FORTUNER LEGENDER", 2024, 1, 44800, 500, "Diesel", "Automatic", "Right", 2755, "Black", "4WD", "brand_new", "<p>Brand new â€” latest model year.</p>", true, false],
];

const featureSets = [
  ["ABS", "Airbag", "A/C", "Power Window", "Navigation", "Back Camera"],
  ["ABS", "Airbag", "Leather Seat", "Sunroof", "Alloy Wheels", "Push Start"],
  ["ABS", "Airbag", "A/C", "Central Locking"],
  ["ABS", "Airbag", "Power Steering", "Fog Lights"],
  ["ABS", "Airbag", "A/C", "Navigation", "Turbo", "Keyless Entry"],
];

async function main() {
  const pool = new pg.Pool({ connectionString: url, max: 2 });
  const c = await pool.connect();

  try {
    await c.query("BEGIN");

    await c.query(`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES (
        'admin@example.com',
        '$2b$10$Xp/4wzISNqbXsksdAjYJg.ki3WPwZmtaL6wBnrkUeoVs1OFc6foua',
        'Admin'
      ) ON CONFLICT (email) DO NOTHING;
    `);

    const makes = [
      ["Toyota", "toyota"],
      ["Ford", "ford"],
      ["Mitsubishi", "mitsubishi"],
      ["Isuzu", "isuzu"],
      ["Nissan", "nissan"],
      ["Honda", "honda"],
    ];
    for (const [name, slug] of makes) {
      await c.query(
        `INSERT INTO makes (name, slug, is_active) VALUES ($1, $2, true) ON CONFLICT (slug) DO NOTHING`,
        [name, slug]
      );
    }

    const bodyTypes = [
      ["Double Cab", "double-cab"],
      ["Standard Cab", "standard-cab"],
      ["SUV", "suv"],
      ["Van", "van"],
      ["Smart Cab", "smart-cab"],
    ];
    for (const [name, slug] of bodyTypes) {
      await c.query(
        `INSERT INTO body_types (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
        [name, slug]
      );
    }

    const modelRows = [
      ["toyota", "Hilux", "hilux"],
      ["toyota", "Fortuner", "fortuner"],
      ["toyota", "Hiace", "hiace"],
      ["ford", "Ranger", "ranger"],
      ["ford", "Everest", "everest"],
      ["mitsubishi", "Triton", "triton"],
      ["mitsubishi", "Pajero Sport", "pajero-sport"],
      ["isuzu", "D-Max", "d-max"],
      ["nissan", "Navara", "navara"],
      ["honda", "CR-V", "cr-v"],
    ];
    for (const [makeSlug, modelName, modelSlug] of modelRows) {
      await c.query(
        `INSERT INTO models (make_id, name, slug, is_active)
         SELECT m.id, $2::varchar, $3::varchar, true FROM makes m
         WHERE m.slug = $1
         AND NOT EXISTS (
           SELECT 1 FROM models mo
           JOIN makes mk ON mo.make_id = mk.id
           WHERE mk.slug = $1 AND mo.slug = $3
         )`,
        [makeSlug, modelName, modelSlug]
      );
    }

    const insertVeh = `
      INSERT INTO vehicles (
        stock_number, make_id, model_id, body_type_id, title, year, month, price, mileage,
        fuel_type, transmission, steering, engine_cc, color, drive_type, condition,
        description, is_active, is_featured, is_clearance
      )
      SELECT $1::varchar, mk.id, mo.id, bt.id, $2::varchar, $3::int, $4::int, $5::numeric, $6::int,
        $7::varchar, $8::varchar, $9::varchar, $10::int, $11::varchar, $12::varchar, $13::varchar,
        $14::text, true, $15::bool, $16::bool
      FROM makes mk
      JOIN models mo ON mo.make_id = mk.id AND mo.slug = $18::varchar
      JOIN body_types bt ON bt.slug = $19::varchar
      WHERE mk.slug = $17::varchar
      ON CONFLICT (stock_number) DO UPDATE SET
        updated_at = NOW()
      RETURNING id;
    `;

    let idx = 0;
    for (const row of vehicles) {
      const [
        stock,
        makeSlug,
        modelSlug,
        bodySlug,
        title,
        year,
        month,
        price,
        mileage,
        fuel,
        trans,
        steer,
        cc,
        color,
        drive,
        cond,
        descHtml,
        isFeat,
        isClear,
      ] = row;

      const ins = await c.query(insertVeh, [
        stock,
        title,
        year,
        month,
        price,
        mileage,
        fuel,
        trans,
        steer,
        cc,
        color,
        drive,
        cond,
        descHtml,
        isFeat,
        isClear,
        makeSlug,
        modelSlug,
        bodySlug,
      ]);

      let vid = ins.rows[0]?.id;
      if (vid == null) {
        const r2 = await c.query(`SELECT id FROM vehicles WHERE stock_number = $1`, [stock]);
        vid = r2.rows[0]?.id;
      }
      if (vid == null) {
        console.warn("Skip images/features for", stock);
        idx++;
        continue;
      }

      await c.query(`DELETE FROM vehicle_features WHERE vehicle_id = $1`, [vid]);
      await c.query(`DELETE FROM vehicle_images WHERE vehicle_id = $1`, [vid]);

      const feats = featureSets[idx % featureSets.length];
      for (const f of feats) {
        await c.query(
          `INSERT INTO vehicle_features (vehicle_id, feature) VALUES ($1, $2)`,
          [vid, f]
        );
      }

      const im1 = imgs[idx % imgs.length];
      const im2 = imgs[(idx + 3) % imgs.length];
      await c.query(
        `INSERT INTO vehicle_images (vehicle_id, url, sort_order, is_primary) VALUES
         ($1, $2, 0, true), ($1, $3, 1, false)`,
        [vid, im1, im2]
      );

      idx++;
    }

    await c.query(`
      INSERT INTO announcements (title, content, is_active)
      SELECT 'Shipping update', 'Container schedules may shift during peak season â€” contact us for ETAs.', true
      WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'Shipping update');
    `);
    await c.query(`
      INSERT INTO announcements (title, content, is_active)
      SELECT 'USD rates', 'Prices shown in USD; bank TT fees may apply.', true
      WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'USD rates');
    `);

    const sampleInquiries = [
      ["John Smith", "john@example.com", "+1 555 0101", "United States", "Los Angeles", "new", "Interested in Hilux"],
      ["Maria Garcia", "maria@example.com", "+34 600 000 000", "Spain", "Barcelona", "read", "Quote for Fortuner"],
    ];
    for (const [name, email, phone, country, port, status, msg] of sampleInquiries) {
      await c.query(
        `INSERT INTO inquiries (name, email, phone, country, destination_port, status, message, vehicle_id)
         SELECT
           $1::varchar,
           $2::varchar,
           $3::varchar,
           $4::varchar,
           $5::varchar,
           $6::varchar,
           $7::text,
           (SELECT id FROM vehicles WHERE stock_number = 'AE-1001' LIMIT 1)
         WHERE NOT EXISTS (
           SELECT 1
           FROM inquiries
           WHERE email = $2::varchar AND message = $7::text
         )`,
        [name, email, phone, country, port, status, msg]
      );
    }

    await c.query(`
      INSERT INTO site_settings (key, value) VALUES
        ('company_name', '9 Yards Auto Export'),
        ('phone', '+66660202902'),
        ('whatsapp', '66660202902'),
        ('whatsapp', '66812345678'),
        ('email', 'info@9yardtrading.com'),
        ('address', '123 Sukhumvit Rd, Bangkok, Thailand'),
        ('hero_banner_url', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `);

    await c.query("COMMIT");
    console.log("Dummy data seeded OK (12 vehicles + features + images + announcements + inquiries + settings).");
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

