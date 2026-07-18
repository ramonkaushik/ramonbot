import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'nets.db')

const VALID_SORTS = new Set([
  'bpm', 'vorp', 'pts', 'reb', 'ast', 'ts_pct',
  'e_net_rating', 'pts_per_75', 'per', 'mpg', 'gp',
])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const faSeason    = searchParams.get('fa_season')    ?? '2026-27'
  const statsSeason = searchParams.get('stats_season') ?? '2025-26'
  const minGP       = parseInt(searchParams.get('min_gp') ?? '20', 10)
  const position    = searchParams.get('position') ?? ''
  const sortBy      = VALID_SORTS.has(searchParams.get('sort_by') ?? '') ? searchParams.get('sort_by')! : 'bpm'
  const limit       = Math.min(parseInt(searchParams.get('limit') ?? '60', 10), 200)

  const posClause = position ? `AND (p.position LIKE '%' || ? || '%')` : ''
  const params    = position
    ? [statsSeason, faSeason, minGP, position, limit]
    : [statsSeason, faSeason, minGP, limit]

  const db   = new Database(DB_PATH, { readonly: true })
  const rows = db.prepare(`
    SELECT
      p.id, p.name, p.position, fa.prior_team, fa.type AS fa_type,
      s.gp, s.mpg, s.pts, s.reb, s.ast, s.stl, s.blk, s.tov,
      s.ts_pct, s.efg_pct, s.usg_pct,
      s.bpm, s.vorp, s.per, s.pts_per_75,
      s.e_off_rating, s.e_def_rating, s.e_net_rating
    FROM free_agents fa
    JOIN players p ON p.id = fa.player_id
    JOIN stats s   ON s.player_id = fa.player_id AND s.season = ?
    WHERE fa.season = ?
      AND (s.gp IS NULL OR s.gp >= ?)
      ${posClause}
    ORDER BY s.${sortBy} DESC NULLS LAST
    LIMIT ?
  `).all(...params)
  db.close()

  return NextResponse.json(rows)
}
