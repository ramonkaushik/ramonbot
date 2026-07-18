import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'nets.db')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const season = searchParams.get('season') ?? '2026-27'

  const db  = new Database(DB_PATH, { readonly: true })
  const cap = db.prepare('SELECT * FROM cap_constants WHERE season = ?').get(season) as Record<string, number> | undefined

  if (!cap) {
    db.close()
    return NextResponse.json({ error: `No cap data for ${season}` }, { status: 404 })
  }

  const contracts = db.prepare(
    'SELECT salary, years_left FROM contracts WHERE season = ?'
  ).all(season) as { salary: number; years_left: number }[]
  db.close()

  const committed = contracts.reduce((s, r) => s + (r.salary ?? 0), 0)
  const expiring  = contracts.reduce((s, r) => s + (r.years_left === 0 ? (r.salary ?? 0) : 0), 0)

  return NextResponse.json({
    season,
    salary_cap:    cap.salary_cap,
    tax_line:      cap.tax_line,
    first_apron:   cap.first_apron,
    second_apron:  cap.second_apron,
    committed,
    expiring,
    projected_next:  committed - expiring,
    space_vs_cap:    Math.max(0, cap.salary_cap - committed),
    room_to_tax:     cap.tax_line - committed,
    room_to_apron1:  cap.first_apron - committed,
    room_to_apron2:  cap.second_apron - committed,
  })
}
