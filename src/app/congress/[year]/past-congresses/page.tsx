import MainNav from '@/components/MainNav';
import Nav from '@/components/Nav';
import MainFooter from '@/components/MainFooter';
import Footer from '@/components/Footer';
import Link from 'next/link';

const congresses = [
  { num: 1, year: 2013, location: 'Seoul, South Korea', venue: 'Korea University', note: 'First inaugural congress after WAHS founding.', flag: '🇰🇷' },
  { num: 2, year: 2014, location: 'Buenos Aires, Argentina', venue: 'National Library', flag: '🇦🇷' },
  { num: 3, year: 2015, location: 'Dubai, United Arab Emirates', venue: 'International Convention Center', flag: '🇦🇪' },
  { num: 4, year: 2016, location: 'Oxford, United Kingdom', venue: 'Oriel College, University of Oxford', flag: '🇬🇧' },
  { num: 5, year: 2017, location: 'Seoul, South Korea', venue: 'University of Seoul', flag: '🇰🇷' },
  { num: 6, year: 2018, location: 'Osaka, Japan', venue: 'Kansai Gaidai University', flag: '🇯🇵' },
  { num: 7, year: 2019, location: 'Jerusalem, Israel', venue: 'Hebrew University of Jerusalem', flag: '🇮🇱' },
  { num: 0, year: 2020, location: 'Cancelled', note: 'All activities cancelled due to Coronavirus.', flag: '⚠️', cancelled: true },
  { num: 8, year: 2021, location: 'Oxford, United Kingdom (Online)', venue: 'Kellogg College, University of Oxford', note: 'Theme: Coronavirus and Pop Culture — Examined pandemic media consumption, digital fandom, and streaming growth.', flag: '🇬🇧' },
  { num: 9, year: 2022, location: 'Seoul, South Korea', venue: 'National Library of Korea', flag: '🇰🇷' },
  { num: 10, year: 2023, location: 'Paris, France', venue: 'M Social Hotel Paris', flag: '🇫🇷' },
  { num: 11, year: 2024, location: 'Seoul, South Korea', venue: 'Youngone Hall (Room 210), Building 101 — Seoul National University Asia Center (SNUAC)', flag: '🇰🇷' },
];

const upcoming = { num: 12, year: 2026, location: 'Jeju Island, South Korea', venue: 'Cheju Halla University', dates: 'May 28–30, 2026', flag: '🇰🇷', link: '/congress/2026' };

export default async function PastCongressesPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  return (
    <>
      <Nav year={year} />
      <section style={{ background: '#fff', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{
              display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.12em',
              textTransform: 'uppercase', color: '#CD2E3A', marginBottom: 8,
            }}>Archive</span>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: '#000', marginBottom: 12,
            }}>WAHS World Congresses</h1>
            <p style={{ color: '#666', fontSize: '1rem' }}>2013 – Present</p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 15, top: 0, bottom: 0, width: 3,
              background: 'linear-gradient(to bottom, #CD2E3A, #0047A0)',
              borderRadius: 2,
            }} />

            {congresses.map((c) => (
              <div key={c.num} style={{ position: 'relative', marginBottom: 28 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -33, top: 6, width: 14, height: 14,
                  borderRadius: '50%', background: '#CD2E3A', border: '3px solid #fff',
                  boxShadow: '0 0 0 2px #CD2E3A',
                }} />
                <div style={{
                  background: '#fff', borderRadius: 12, padding: '20px 24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1px solid #eee',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.4rem' }}>{c.flag}</span>
                    <span style={{
                      fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: '#000',
                    }}>
                      {(c as any).cancelled ? (
                        <span style={{ color: '#999' }}>{c.year} — Cancelled</span>
                      ) : (c as any).link ? (
                        <Link href={(c as any).link} style={{ color: '#0047A0', textDecoration: 'none' }}>
                          {c.year} — {getOrdinal(c.num)} World Congress
                        </Link>
                      ) : (
                        <>{c.year} — {getOrdinal(c.num)} World Congress</>
                      )}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#555', margin: 0, lineHeight: 1.6 }}>
                    {!(c as any).cancelled && <>📍 {c.location}</>}
                    {c.venue && <><br />🏫 {c.venue}</>}
                    {c.note && <><br /><span style={{ fontSize: '0.85rem', color: '#888' }}>{c.note}</span></>}
                  </p>
                </div>
              </div>
            ))}

            {/* Upcoming */}
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <div style={{
                position: 'absolute', left: -33, top: 6, width: 14, height: 14,
                borderRadius: '50%', background: '#0047A0', border: '3px solid #fff',
                boxShadow: '0 0 0 2px #0047A0',
              }} />
              <div style={{
                background: 'linear-gradient(135deg, #0047A0 0%, #002d6a 100%)', borderRadius: 12,
                padding: '20px 24px', color: '#fff',
                boxShadow: '0 4px 20px rgba(0,71,160,.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.4rem' }}>{upcoming.flag}</span>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem' }}>
                    <Link href={upcoming.link} style={{ color: '#fff', textDecoration: 'none' }}>
                      {upcoming.year} — {getOrdinal(upcoming.num)} World Congress
                    </Link>
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.08em',
                    textTransform: 'uppercase', background: '#CD2E3A', color: '#fff',
                    padding: '3px 10px', borderRadius: 4,
                  }}>Upcoming</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6 }}>
                  📍 {upcoming.location}<br />
                  🏫 {upcoming.venue}<br />
                  📅 {upcoming.dates}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
