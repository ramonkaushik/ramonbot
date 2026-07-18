'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

const mixes = [
  { file: "dark_room_sessions_vol3.mp3",  label: "Dark Room Sessions Vol. 3",  date: "2/14/2024", size: "143 MB", url: "#" },
  { file: "sunday_morning_slow_burn.mp3",  label: "Sunday Morning Slow Burn",    date: "11/3/2023",  size: "112 MB", url: "#" },
  { file: "club_night_basement_series.mp3",label: "Club Night: Basement Series", date: "8/19/2023",  size: "204 MB", url: "#" },
];

const W = {
  desktop:    "#008080",
  silver:     "#c0c0c0",
  white:      "#ffffff",
  darkGray:   "#808080",
  darkest:    "#404040",
  navy:       "#000080",
  titleText:  "#ffffff",
  black:      "#000000",
  selectBlue: "#000080",
  selectText: "#ffffff",
  inset:      "#dfdfdf",
};

const raised: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: `${W.white} ${W.darkGray} ${W.darkGray} ${W.white}`,
};

const sunken: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: `${W.darkGray} ${W.white} ${W.white} ${W.darkGray}`,
};

function WinBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      style={{
        ...pressed
          ? { borderColor: `${W.darkGray} ${W.white} ${W.white} ${W.darkGray}` }
          : { borderColor: `${W.white} ${W.darkGray} ${W.darkGray} ${W.white}` },
        background: W.silver,
        borderStyle: "solid",
        borderWidth: "2px",
        minWidth: "75px",
        padding: "3px 8px",
        fontFamily: '"Tahoma", "Arial", sans-serif',
        fontSize: "11px",
        cursor: "default",
        color: W.black,
        outline: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }}
    >
      {children}
    </button>
  );
}

function TitleBar({ icon, title, active = true }: { icon: string; title: string; active?: boolean }) {
  return (
    <div style={{
      background: active ? `linear-gradient(to right, ${W.navy}, #1084d0)` : "#808080",
      color: W.titleText,
      padding: "3px 4px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      userSelect: "none",
    }}>
      <span style={{ fontFamily: '"Tahoma","Arial",sans-serif', fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
        <span>{icon}</span>{title}
      </span>
      <div style={{ display: "flex", gap: "2px" }}>
        {["─", "□", "✕"].map((b, i) => (
          <div key={i} style={{
            ...raised,
            background: W.silver,
            width: "16px",
            height: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: i === 2 ? "10px" : "8px",
            fontWeight: "bold",
            color: W.black,
            cursor: "default",
            fontFamily: '"Tahoma","Arial",sans-serif',
            flexShrink: 0,
          }}>
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AudioServicesPage() {
  const [time, setTime] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [visitorNum] = useState(() => Math.floor(Math.random() * 9000 + 1000));

  useEffect(() => {

    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const base: React.CSSProperties = {
    fontFamily: '"Tahoma", "MS Sans Serif", "Arial", sans-serif',
    fontSize: "11px",
    color: W.black,
  };

  return (
    <div style={{
      ...base,
      minHeight: "100vh",
      background: W.desktop,
      paddingBottom: "38px",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tahoma&display=swap');

        * { box-sizing: border-box; }

        .file-row {
          display: flex;
          align-items: center;
          padding: 1px 4px;
          gap: 6px;
          cursor: default;
          user-select: none;
          white-space: nowrap;
        }
        .file-row:hover { background: #000080; color: #ffffff; }
        .file-row.selected { background: #000080; color: #ffffff; }

        .menu-item {
          padding: 2px 6px;
          cursor: default;
        }
        .menu-item:hover {
          background: #000080;
          color: #ffffff;
        }

        .marquee-wrap {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-inner {
          display: inline-block;
          animation: scroll-left 22s linear infinite;
        }
        @keyframes scroll-left {
          from { transform: translateX(100%); }
          to   { transform: translateX(-100%); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .blink { animation: blink 1s step-end infinite; }

        .taskbar-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          background: #c0c0c0;
          border: 2px solid;
          border-color: #808080 #ffffff #ffffff #808080;
          font-family: "Tahoma", "Arial", sans-serif;
          font-size: 11px;
          font-weight: bold;
          cursor: default;
          color: #000;
          min-width: 120px;
        }

        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* ── DESKTOP ── */}
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "660px", margin: "0 auto" }}>

        {/* ── WINDOW 1: My Mixes (Explorer) ── */}
        <div style={{ ...raised, background: W.silver }}>
          <TitleBar icon="🗂️" title="My Mixes — ramón" />

          {/* Menu bar */}
          <div style={{ borderBottom: `1px solid ${W.darkGray}`, display: "flex", padding: "1px 2px" }}>
            {["File", "Edit", "View", "Go", "Help"].map(m => (
              <span key={m} className="menu-item">{m}</span>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ borderBottom: `1px solid ${W.darkGray}`, padding: "3px 4px", display: "flex", gap: "4px", alignItems: "center" }}>
            <WinBtn>◀ Back</WinBtn>
            <WinBtn>▶ Forward</WinBtn>
            <WinBtn>⬆ Up</WinBtn>
            <div style={{ width: "1px", height: "20px", background: W.darkGray, margin: "0 4px" }} />
            <WinBtn>
              <Link href="/">← ramón.bot</Link>
            </WinBtn>
          </div>

          {/* Address bar */}
          <div style={{ borderBottom: `1px solid ${W.darkGray}`, padding: "3px 6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ flexShrink: 0 }}>Address</span>
            <div style={{ ...sunken, background: W.white, padding: "1px 4px", flex: 1, display: "flex", alignItems: "center" }}>
              <span style={{ color: "#0000ee" }}>C:\ramón\mixes\</span>
              <span className="blink" style={{ marginLeft: "1px" }}>▌</span>
            </div>
          </div>

          {/* File list */}
          <div style={{ ...sunken, background: W.white, margin: "6px", minHeight: "120px" }}>
            {/* Column headers */}
            <div style={{ display: "flex", borderBottom: `1px solid ${W.darkGray}`, background: W.silver }}>
              {[["Name", "calc(100% - 220px)"], ["Size", "70px"], ["Date Modified", "150px"]].map(([label, w]) => (
                <div key={label} style={{
                  ...raised,
                  padding: "1px 6px",
                  width: w,
                  flexShrink: 0,
                  borderTop: "none",
                  borderLeft: "none",
                  cursor: "default",
                }}>
                  {label}
                </div>
              ))}
            </div>

            {mixes.map((mix, i) => (
              <a key={i} href={mix.url} target="_blank" rel="noopener noreferrer"
                className={`file-row${selected === i ? " selected" : ""}`}
                onClick={() => setSelected(i)}
              >
                <span style={{ flexShrink: 0 }}>🎵</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{mix.file}</span>
                <span style={{ width: "70px", flexShrink: 0, textAlign: "right", paddingRight: "8px" }}>{mix.size}</span>
                <span style={{ width: "150px", flexShrink: 0 }}>{mix.date}</span>
              </a>
            ))}
          </div>

          {/* Status bar */}
          <div style={{ ...sunken, margin: "0 6px 6px", padding: "1px 6px", display: "flex", justifyContent: "space-between" }}>
            <span>{selected !== null ? `1 object(s) selected — ${mixes[selected].label}` : `${mixes.length} object(s)`}</span>
            <span>🔊 <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0000ee" }}>SoundCloud ↗</a></span>
          </div>
        </div>

        {/* ── WINDOW 2: Dialog — Mastering ── */}
        <div style={{ ...raised, background: W.silver }}>
          <TitleBar icon="⚠️" title="ramón.exe — Message" />
          <div style={{ padding: "16px 16px 12px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "32px", lineHeight: 1, flexShrink: 0 }}>⚠️</div>
            <div>
              <p style={{ margin: "0 0 10px", lineHeight: "1.7" }}>
                i dj, produce, &amp; master mixes.<br />
                send your file — we&apos;ll work on it together.
              </p>
              <p style={{ margin: 0, lineHeight: "1.7" }}>
                <span style={{ color: W.darkGray }}>→ </span>
                <a href="mailto:kaushikramon@gmail.com?subject=Mix" style={{ color: "#0000ee", textDecoration: "underline" }}>
                  kaushikramon@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${W.darkGray}`, padding: "8px 16px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <WinBtn><a href="mailto:kaushikramon@gmail.com?subject=Mix">📧 Send File</a></WinBtn>
            <WinBtn><Link href="/">Cancel</Link></WinBtn>
          </div>
        </div>

        {/* ── WINDOW 3: Properties / Bio ── */}
        <div style={{ ...raised, background: W.silver }}>
          <TitleBar icon="ℹ️" title="ramón — Properties" active={false} />

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `2px solid ${W.darkGray}`, marginTop: "4px", paddingLeft: "4px" }}>
            {["General", "Bio", "Contact"].map((tab, i) => (
              <div key={tab} style={{
                padding: "3px 12px",
                background: i === 0 ? W.silver : W.inset,
                border: `2px solid ${W.darkGray}`,
                borderBottom: i === 0 ? `2px solid ${W.silver}` : undefined,
                marginBottom: i === 0 ? "-2px" : undefined,
                marginRight: "2px",
                cursor: "default",
                zIndex: i === 0 ? 1 : 0,
                position: "relative",
              }}>
                {tab}
              </div>
            ))}
          </div>

          <div style={{ ...sunken, margin: "6px", padding: "10px 12px", background: W.white }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Name:", "Ramón Kaushik"],
                  ["Location:", "New York, NY"],
                  ["Type:", "DJ / Producer / Mastering"],
                  ["Active Since:", "2018"],
                  ["Genres:", "Techno, House, Experimental"],
                  ["Status:", "✅ Available"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: "2px 8px 2px 0", color: W.darkGray, whiteSpace: "nowrap", verticalAlign: "top" }}>{k}</td>
                    <td style={{ padding: "2px 0", fontWeight: k === "Status:" ? "bold" : undefined }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Marquee */}
          <div style={{ ...sunken, margin: "0 6px 6px", padding: "2px 4px", background: W.white, overflow: "hidden" }}>
            <div className="marquee-wrap">
              <span className="marquee-inner" style={{ color: W.navy }}>
                ★ NEW YORK &nbsp;·&nbsp; DJ &nbsp;·&nbsp; MASTERING &nbsp;·&nbsp; 2018 — &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                ★ TECHNO &nbsp;·&nbsp; HOUSE &nbsp;·&nbsp; EXPERIMENTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                ★ kaushikramon@gmail.com &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>

        {/* ── Hit counter ── */}
        <div style={{ textAlign: "center", color: "#00ffff", fontFamily: '"Courier New", monospace', fontSize: "10px", letterSpacing: "0.1em" }}>
          ★ YOU ARE VISITOR #{visitorNum} ★ BEST VIEWED IN 800×600 ★
        </div>

      </div>

      {/* ── TASKBAR ── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "30px",
        background: W.silver,
        borderTop: `2px solid ${W.white}`,
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
        gap: "4px",
        zIndex: 100,
      }}>
        {/* Start */}
        <div style={{
          ...raised,
          background: W.silver,
          padding: "2px 8px",
          fontWeight: "bold",
          fontFamily: '"Tahoma","Arial",sans-serif',
          fontSize: "11px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          cursor: "default",
        }}>
          <span>⊞</span> Start
        </div>

        {/* Divider */}
        <div style={{ width: "2px", height: "20px", borderLeft: `1px solid ${W.darkGray}`, borderRight: `1px solid ${W.white}` }} />

        {/* Window button */}
        <div className="taskbar-btn" style={{ flex: 1, maxWidth: "200px" }}>
          🗂️ My Mixes — ramón
        </div>

        {/* Right side: clock */}
        <div style={{ marginLeft: "auto", ...sunken, padding: "1px 8px", fontFamily: '"Tahoma","Arial",sans-serif', fontSize: "11px" }}>
          {time}
        </div>
      </div>
    </div>
  );
}
