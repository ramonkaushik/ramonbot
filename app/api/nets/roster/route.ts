import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'nets.db')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rosterSeason = searchParams.get('roster_season') ?? '2026-27'
  const statsSeason  = searchParams.get('stats_season')  ?? '2025-26'

  const db   = new Database(DB_PATH, { readonly: true })
  const rows = db.prepare(`
    SELECT
      p.id, p.name, p.position,
      c.salary, c.years_left, c.option_type,
      s.gp, s.mpg, s.pts, s.reb, s.ast, s.stl, s.blk, s.tov,
      s.ts_pct, s.efg_pct, s.usg_pct,
      s.bpm, s.vorp, s.per, s.pts_per_75,
      s.e_off_rating, s.e_def_rating, s.e_net_rating
    FROM players p
    JOIN contracts c ON p.id = c.player_id AND c.season = ?
    LEFT JOIN stats s ON p.id = s.player_id AND s.season = ?
    ORDER BY c.salary DESC
  `).all(rosterSeason, statsSeason)
  db.close()

  return NextResponse.json(rows)
}
