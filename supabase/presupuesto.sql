-- Configuración general de la aplicación (clave/valor)
CREATE TABLE IF NOT EXISTS configuracion (
  clave      TEXT PRIMARY KEY,
  valor      TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_select" ON configuracion FOR SELECT TO authenticated USING (true);
CREATE POLICY "config_insert" ON configuracion FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "config_update" ON configuracion FOR UPDATE TO authenticated USING (true);

-- Presupuestos: límite de gasto mensual recurrente por categoría
CREATE TABLE IF NOT EXISTS presupuestos (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID REFERENCES categorias(id) NOT NULL,
  monto_limite NUMERIC NOT NULL CHECK (monto_limite > 0),
  moneda       TEXT NOT NULL CHECK (moneda IN ('DOP', 'USD')),
  created_by   UUID REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(categoria_id, moneda)
);

ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "presupuestos_all" ON presupuestos FOR ALL TO authenticated USING (true) WITH CHECK (true);
