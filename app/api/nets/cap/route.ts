import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'nets.db')

// Update these each offseason when the league sets new thresholds.
const CAP_2026_27 = {
  salary_cap:   148_000_000,
  tax_line:     180_500_000,
  first_apron:  187_600_000,
  second_apron: 198_400_000,
}

export async function GET() {
  const db = new Database(DB_PATH, { readonly: true })

  const contracts = db.prepare(
    'SELECT salary, years_left FROM contracts WHERE season = ?'
  ).all('2026-27') as { salary: number; years_left: number }[]
  db.close()

  const cap = CAP_2026_27
  const committed = contracts.reduce((s, r) => s + (r.salary ?? 0), 0)
  const expiring  = contracts.reduce((s, r) => s + (r.years_left === 0 ? (r.salary ?? 0) : 0), 0)

  return NextResponse.json({
    season:          '2026-27',
    salary_cap:      cap.salary_cap,
    tax_line:        cap.tax_line,
    first_apron:     cap.first_apron,
    second_apron:    cap.second_apron,
    committed,
    expiring,
    projected_next:  committed - expiring,
    space_vs_cap:    Math.max(0, cap.salary_cap - committed),
    room_to_tax:     cap.tax_line - committed,
    room_to_apron1:  cap.first_apron - committed,
    room_to_apron2:  cap.second_apron - committed,
  })
}
