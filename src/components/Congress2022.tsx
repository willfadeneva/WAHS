'use client';
import { useState } from 'react';

/* ── tiny helpers ── */
const Badge = ({ children, color = 'var(--kr-red)' }: { children: React.ReactNode; color?: string }) => (
  <span style={{
    display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.08em',
    textTransform: 'uppercase', background: color, color: '#fff',
    padding: '3px 10px', borderRadius: '4px', marginBottom: 6,
  }}>{children}</span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.12em',
    textTransform: 'uppercase', color: 'var(--kr-red)', marginBottom: 8,
  }}>{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{
    fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.6rem,4vw,2.4rem)',
    marginBottom: 12, color: 'var(--kr-black)',
  }}>{children}</h2>
);

/* ── data ── */
const congratulatorySpeeches = [
  { name: 'Dr. Moon Siyeon', title: 'President of WAHS', affiliation: 'Prof, Sookmyung Women\'s University — French Culture', bio: 'Order of Merit for Culture and Arts of France (Officier), Order of Merit for Education of France (Chevalier). VP Korean Federation of Women Professors, Board Member Korea-France Association.' },
  { name: 'Mr. JUNG Kilhwa', title: 'President, KOFICE', affiliation: 'Korean Foundation for International Cultural Exchange', bio: 'PhD Journalism/Media, Hankuk Univ of Foreign Studies. Former MBC (1984–), Director of Promotion Relations, Chief Producer, Mid/South American Branch CEO. 12th President of PD Association. Awards: Broadcasting Award, Unification Media Award, Democratic Media Award, Samsung Media Award. Co-author "The Squid Game and Content Revolution".' },
  { name: 'Mr. SEONG Ghihong', title: 'CEO, Yonhap News Agency', affiliation: '', bio: 'Joined Yonhap 1992. Washington correspondent, political director, political editor, editorial member, foreign language editor, Yonhap News TV news director.' },
  { name: 'Mr. Philippe LEFORT', title: 'Ambassador of France to Republic of Korea', affiliation: '', bio: 'Former Director General for Information Systems, Ministry of Europe and Foreign Affairs. Served in Tokyo, Washington, Moscow, Tbilisi. Ambassador to Georgia, EU Special Representative for the Caucasus.' },
  { name: 'Mr. Akiva Tor', title: 'Ambassador of Israel to Republic of Korea', affiliation: '', bio: 'Former Head of Bureau for World Jewish Affairs, Consul General in San Francisco, Director Israel Economic and Cultural Office in Taipei. Harvard Kennedy School, MA Hebrew University, BA Columbia University.' },
];

const mcs = [
  { name: 'Ms. YU Sejin', role: 'MC', bio: 'Yonhapnews MC, K Story MC/Writer, JTBC MC, KBS Docu ON MC/voice actor, Gugak Broadcasting "Sunshine on the Window" Tuesday Host.' },
  { name: 'Ms. KIM Youngmi', role: 'MC & Academic Director of WAHS', bio: 'CEO of MUSHROOM, Visiting Professor Sookmyung Women\'s University Graduate School.' },
];

const organizers = [
  { name: 'Ms. Ophélie Surcouf', role: 'Writer & Consultant', bio: 'France-based writer consulting on Korean Wave. Covers Korea, tech, pop-culture.' },
  { name: 'Dr. LEE Jangwoo', role: 'President, WCIF', bio: 'Non-executive Director Korea Foundation, Chairman DIMF, Emeritus Prof Kyungpook National University. Author of 20 books incl. "K-pop Innovation".' },
  { name: 'Dr. KIM Chulwon', role: 'Prof, Kyung Hee University', bio: 'College of Hotel and Tourism Management. MICE tourism, cultural tourism, sustainable tourism, SDGs.' },
  { name: 'Dr. SUH Yong-gu', role: 'Organizer', bio: '' },
  { name: 'Ms. Jessica COHEN', role: 'Founder & Editor-in-Chief, K-Society Magazine', bio: '12 years as Communication Director for GONG TV Channel (French Korean broadcaster). Founded K-Society Magazine (2019). Hallyu specialist in K-drama & Webtoon.' },
  { name: 'Mr. Mathieu Berbiguier', role: 'PhD Candidate, UCLA', bio: 'Asian Languages & Cultures (Korean), Gender Studies & Digital Humanities. Fellow at Academy of Korean Studies. Research on K-pop fandoms and power dynamics.' },
  { name: 'Dr. LEE Jeeheng', role: 'Prof, Chung-Ang University', bio: 'Film & cultural studies. Published "BTS and ARMY Culture" (2019) & "Femidology" (2022).' },
  { name: 'Dr. CHO Sung-eun', role: 'Prof, Hankuk University of Foreign Studies', bio: 'Dept of EICC. President of Korean Association of Translation Studies. Research in audiovisual translation, fan translation.' },
];

type Speaker = { name: string; affiliation: string; topic: string };
type Track = { title: string; moderator?: string; discussion?: string; speakers: Speaker[] };
type DayData = { label: string; tracks: Track[] };

const focusSession: Track = {
  title: 'Focus Session: Woman in K-Wave',
  speakers: [
    { name: 'Mr. KIM Hongki', affiliation: 'LOEN / Naver / Kakao · Dingo Music · K-Pop Radar · Blip', topic: 'Landscape of K-POP' },
    { name: 'Ms. KIM Eunjung', affiliation: 'CJ E&M · MTV Korea · SBS Medianet · Cube Entertainment', topic: 'Woman in K-wave' },
    { name: 'Ms. PARK Jung-hyun', affiliation: 'Co-CEO Mr.Romance · Moving (Disney+) · Google Korea', topic: 'Woman in K-wave' },
    { name: 'Ms. KANG Jihyun', affiliation: 'CEO Serviceplan Korea · 100+ intl awards incl Cannes Lions', topic: 'Woman in K-wave' },
  ],
};

const days: DayData[] = [
  {
    label: 'Day 1 — October 20',
    tracks: [
      {
        title: 'Track 1: Acceptance and Embracing of Hallyu',
        moderator: 'Sam Richards',
        discussion: 'Sang Min Shim, Ophélie Surcouf, Carlos Gorito, Sebastien Falletti',
        speakers: [
          { name: 'Mr. Vincenzo Cicchelli', affiliation: 'Assoc Prof, Université de Paris Cité', topic: 'When Global Hallyu meets Global Youth' },
          { name: 'Dr. Sylvie Octobre', affiliation: 'Ministry of Culture France, ENS Lyon', topic: 'When Global Hallyu meets Global Youth' },
          { name: 'Dr. SONG Jungeun', affiliation: 'Future Industry Strategy Institution', topic: 'K-pop fandom participatory cultures in empathy' },
          { name: 'Dr. HWANG Seongbin', affiliation: 'Prof, Rikkyo University', topic: 'Embracing K-Drama under Covid 19' },
        ],
      },
      {
        title: 'Track 1: Ministry of Culture Special Session',
        moderator: 'Jang Woo Lee',
        discussion: 'Kyu Sun Hong, Ji Hoon Yang, Sung Hee Lim, Park Moon-goo',
        speakers: [
          { name: 'Mr. PARK Chanuk', affiliation: 'Director, Cultural Industry Research Center KCTI', topic: 'Theoretical framework for online concerts' },
          { name: 'Dr. KIM Sunhyuk', affiliation: 'Prof, Korea University (PhD Stanford)', topic: 'Global Citizenship in Korean Soft Power' },
          { name: 'Dr. KIM Heesun', affiliation: 'Assoc Prof, Kookmin University', topic: 'K-Heritage as Next Hallyu' },
        ],
      },
      {
        title: 'Track 2: Sustainability — New Chapter in Hallyu Tourism',
        moderator: 'Cheol Won Kim',
        discussion: 'Young Moon Kim, Joo Hyung Han, Ki Tak Choi, Yong Gun Suh',
        speakers: [
          { name: 'Dr. PARK Jieun', affiliation: 'PhD Geography, Univ Paris 1', topic: 'Exploring New Hallyu Tourism by Korean Heritage' },
          { name: 'Dr. YOON Hyejin', affiliation: 'Baewha Women\'s University', topic: 'Temple Stay as K-culture' },
          { name: 'Dr. CHOI Ayeon', affiliation: 'PhD Kyunghee, MA U of Surrey', topic: 'Cultural Sustainability of New K-Tourism' },
          { name: 'Dr. LEE Gyumin', affiliation: 'Assoc Prof, Kyung Hee University', topic: 'Dissemination Strategy of K-Food' },
          { name: 'Dr. KIM Jangwon', affiliation: 'Sr Director, Global Destination Marketing Institute', topic: 'Quality of Life from Hosting Mega-Events' },
        ],
      },
      {
        title: 'Track 2: Change Makers in Industry — Hallyu',
        moderator: 'Yong Gu Suh',
        discussion: 'BAE Ilhyun',
        speakers: [
          { name: 'Dr. HAN Yujin', affiliation: 'Prof, Sookmyung Women\'s University', topic: 'K-Entrepreneurship for Globalization of Arts and Cultures' },
          { name: 'Dr. BANG Joonseok', affiliation: 'Prof College of Pharmacy, CEO Haven Care', topic: 'Digital healthcare technology like Korean Wave' },
          { name: 'Dr. LEE Donghan', affiliation: 'Visiting Prof Sookmyung, Director Data Analysis Lab', topic: 'K-Start up: Present and Future' },
        ],
      },
      {
        title: 'Track 3: Evolution of Fandom, Dynamics of Hallyu',
        moderator: 'Jessica Cohen',
        discussion: 'Jimmyn Parc, Sylvie Octobre, Gregory Lee Harrell',
        speakers: [
          { name: 'Dr. Stefania Pozzi', affiliation: 'PhD, University of Leeds', topic: 'Korean Music Promotion in Japan' },
          { name: 'Dr. Irina Lyan', affiliation: 'Asst Prof, Hebrew University', topic: 'Fandom fan-entrepreneurship in Israel' },
          { name: 'Dr. Nissim Otmazgin', affiliation: 'Dean of Humanities, Hebrew University', topic: 'Fan-entrepreneurship in Israel' },
          { name: 'Ms. Cecilia Perez', affiliation: 'MBA Branding, Bangtan Scholars co-founder', topic: 'BTS Leadership in Culture and ESG' },
        ],
      },
      {
        title: 'Track 3: Young Researchers Session',
        moderator: 'Mathieu Berbiguier',
        discussion: 'JunKyu Park, Leah Rabinovitch',
        speakers: [
          { name: 'Ms. Dmitrieva Mariia', affiliation: 'Korea University', topic: 'Cultural Differences in Fan Community Building: BTS and ARMY' },
          { name: 'Ms. Jing Huang', affiliation: 'Korea University', topic: 'Representations in Sweet Home' },
          { name: 'Dr. Melissa Rubio dos Santos', affiliation: 'PhD, UFRGS Brazil', topic: 'Reception of Contemporary Korean Literature: Pachinko' },
          { name: 'Ms. Anna Penkova', affiliation: 'Korea University', topic: 'Transliteration of Korean names into Russian in K-dramas' },
        ],
      },
    ],
  },
  {
    label: 'Day 2 — October 21',
    tracks: [
      {
        title: 'Track 1: Hallyu, Women and Multiculturalism',
        moderator: 'Jeeheng Lee',
        discussion: 'Lucia Rud, Mathieu Berbiguier, Song Jungeun',
        speakers: [
          { name: 'Ms. Leah Rabinovitch', affiliation: 'Hebrew University', topic: 'Ecological practices among Korean housewives on Youtube' },
          { name: 'Dr. Susan Grantham', affiliation: 'Prof, University of Hartford', topic: 'K-Dramas Portrayal of Women\'s Empowerment' },
          { name: 'Dr. Lucía Rud', affiliation: 'U of Buenos Aires / CONICET', topic: 'Imaginaries of Latin America in Korean television' },
          { name: 'Dr. Matías Benítez', affiliation: 'U of La Plata / CONICET', topic: 'Imaginaries of Latin America in Korean television' },
          { name: 'Ms. Chinelo Chikelu', affiliation: 'Writer, arts & culture', topic: 'Blacks and Blasians in South Korea' },
        ],
      },
      {
        title: 'Track 2: Politics, Policies, and Images in Media',
        moderator: 'Ophélie Surcouf',
        discussion: 'Irina Lyan, Nissim Otmazgin',
        speakers: [
          { name: 'Ms. Romina Delmonte', affiliation: 'PhD candidate, U of Buenos Aires', topic: 'Korean cuisine in Buenos Aires' },
          { name: 'Dr. Jimmyn Parc', affiliation: 'Assoc Prof, University of Malaya', topic: 'Political Manoeuvring in Cultural Industries' },
          { name: 'Dr. Elad Segev', affiliation: 'Assoc Prof, Tel Aviv University', topic: 'South Korea in World Media Gaze: Squid Game vs Kim Jong-il' },
          { name: 'Dr. B.C. Ben Park', affiliation: 'Prof, Penn State Brandywine', topic: 'Triple Revolution and Korean Wave' },
        ],
      },
      {
        title: 'Track 3: Online Session — New Platform New Wave',
        moderator: 'Sung-eun Cho',
        discussion: 'Ly Quyet Tien, Seongbin Hwang, Cecilia Perez',
        speakers: [
          { name: 'Ms. Virgine Sacoman', affiliation: 'MSc, UNISINOS Brazil', topic: 'K-pop fandom and 2022 Elections in Brazil' },
          { name: 'Ms. Constanza Jorquera', affiliation: 'PhD candidate, U of Santiago de Chile', topic: 'K-Pop Political activism in Chilean election' },
          { name: 'Dr. Julia Trzcińska', affiliation: 'Asst Prof, U of Wrocław Poland', topic: 'K-pop idols through TikTok users' },
          { name: 'Dr. Cansu Arısoy Gedik', affiliation: 'Lecturer, Istanbul Kent University', topic: 'Sex-typing of Gender Identity in K-Pop' },
          { name: 'Ms. Melisa Pirol', affiliation: 'Research Asst, Istanbul Kent University', topic: 'Sex-typing of Gender Identity in K-Pop' },
          { name: 'Dr. Arnel E. Joven', affiliation: 'Asst Prof, U of Asia and the Pacific', topic: 'Hansik and Hallyu in Philippine Context' },
          { name: 'Dr. Ly Quyet Tien', affiliation: 'Eastern International University Vietnam', topic: 'Future of Hallyu in Vietnam' },
        ],
      },
      {
        title: 'Plenary Session: Challenges and Future',
        moderator: 'Siyeun Moon (President WAHS)',
        discussion: 'Jessica Cohen, Sam Richards, Choi Hang-seop, Lee Tae-Jun',
        speakers: [
          { name: 'Dr. SHIM Sangmin', affiliation: 'Prof, Sungshin Women\'s University', topic: 'New Game Contents' },
          { name: 'Mr. SHIN Josh Seokjin', affiliation: 'VP Krafton, PUBG creative', topic: 'Future of Creativity: PUBG & Virtual Human ANA' },
          { name: 'Dr. JIN Youngsun', affiliation: 'PhD Central Saint Martins, Nam June Paik collaborator', topic: 'PAIK Nam June\'s Dream in 21st Century' },
          { name: 'Dr. Benjamin Joinau', affiliation: 'Cultural Anthropology, Hongik University', topic: 'The manhwa, new platform for societal questions' },
          { name: 'Mr. Stephan Boschat', affiliation: 'Co-founder MAKMA, printoonization', topic: 'Potential of Webtoon in Europe' },
          { name: 'Dr. SHIN Haerin', affiliation: 'Asst Prof, Korea University', topic: 'Compression Culture: Alternate Lives of Webtoons' },
        ],
      },
    ],
  },
];

/* ── styles ── */
const card: React.CSSProperties = {
  background: '#fff', borderRadius: 12, padding: '24px 28px',
  boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1px solid #eee',
};

const section: React.CSSProperties = {
  maxWidth: 1100, margin: '0 auto', padding: '60px 24px',
};

/* ── sub-components ── */
function PersonCard({ name, title, bio, color = 'var(--kr-blue)' }: { name: string; title: string; bio: string; color?: string }) {
  return (
    <div style={{ ...card, borderLeft: `4px solid ${color}` }}>
      <h4 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', marginBottom: 4 }}>{name}</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--kr-blue)', fontWeight: 600, marginBottom: 6 }}>{title}</p>
      {bio && <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.5 }}>{bio}</p>}
    </div>
  );
}

function TrackSection({ track }: { track: Track }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h3 style={{
        fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem',
        borderBottom: '2px solid var(--kr-red)', paddingBottom: 8, marginBottom: 16,
        color: 'var(--kr-black)',
      }}>{track.title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {track.speakers.map((s, i) => (
          <div key={i} style={{ ...card, padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'baseline', marginBottom: 4 }}>
              <strong style={{ fontSize: '0.95rem' }}>{s.name}</strong>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>— {s.affiliation}</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--kr-blue)', fontWeight: 500, fontStyle: 'italic' }}>"{s.topic}"</p>
          </div>
        ))}
      </div>
      {(track.moderator || track.discussion) && (
        <div style={{ fontSize: '0.8rem', color: '#777', marginTop: 10, paddingLeft: 4 }}>
          {track.moderator && <span><strong>Moderator:</strong> {track.moderator}</span>}
          {track.moderator && track.discussion && <span> · </span>}
          {track.discussion && <span><strong>Discussion:</strong> {track.discussion}</span>}
        </div>
      )}
    </div>
  );
}

/* ── main component ── */
export default function Congress2022() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <>
      {/* Hero */}
      <header style={{
        background: 'var(--kr-black)', color: '#fff',
        padding: '100px 24px 60px', textAlign: 'center', position: 'relative',
      }}>
        <Badge color="#666">Past Event · Archived</Badge>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(1.8rem, 5vw, 3rem)', margin: '12px 0 8px',
        }}>9th World Congress for Hallyu Studies</h1>
        <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: 6 }}>October 20–21, 2022</p>
        <p style={{ fontSize: '0.95rem', color: '#999' }}>National Library of Korea · Seoul, South Korea</p>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, var(--kr-red) 50%, var(--kr-blue) 50%)',
        }} />
      </header>

      {/* Keynote */}
      <div style={{ ...section }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <SectionLabel>Keynote Speaker</SectionLabel>
          <SectionTitle>Dr. Sam Richards</SectionTitle>
          <p style={{ fontSize: '0.95rem', color: '#555', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
            Award-winning sociologist at Penn State University. Creator of SOC 119 — the largest race and culture course in the US — with 70M+ video views. TEDx "Radical Experiment in Empathy" (4M+ views). Co-Founder of the World in Conversation Center.
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Badge color="var(--kr-blue)">Talk to Talk</Badge>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>Youngmi Kim (CEO of MUSHROOM) in conversation with Sam Richards</p>
        </div>
      </div>

      <hr style={{ border: 'none', height: 1, background: '#eee', maxWidth: 1100, margin: '0 auto' }} />

      {/* Congratulatory Speeches */}
      <div style={{ ...section }} id="congratulatory">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SectionLabel>Opening Ceremony</SectionLabel>
          <SectionTitle>Congratulatory Speeches</SectionTitle>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Distinguished guests who delivered opening remarks</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {congratulatorySpeeches.map((p, i) => (
            <PersonCard key={i} name={p.name} title={[p.title, p.affiliation].filter(Boolean).join(' · ')} bio={p.bio} color="var(--kr-red)" />
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', height: 1, background: '#eee', maxWidth: 1100, margin: '0 auto' }} />

      {/* MCs & Organizers */}
      <div style={{ ...section }} id="committee">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SectionLabel>Committee &amp; Hosts</SectionLabel>
          <SectionTitle>MCs &amp; Organizers</SectionTitle>
        </div>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', marginBottom: 12, color: 'var(--kr-red)' }}>Masters of Ceremonies</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 32 }}>
          {mcs.map((p, i) => (
            <PersonCard key={i} name={p.name} title={p.role} bio={p.bio} color="var(--kr-blue)" />
          ))}
        </div>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', marginBottom: 12, color: 'var(--kr-red)' }}>Key Participants &amp; Organizers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {organizers.map((p, i) => (
            <PersonCard key={i} name={p.name} title={p.role} bio={p.bio} />
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', height: 1, background: '#eee', maxWidth: 1100, margin: '0 auto' }} />

      {/* Focus Session */}
      <div style={{ ...section, background: '#fafafa', maxWidth: '100%', padding: '60px 24px' }} id="focus">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SectionLabel>Special Session</SectionLabel>
            <SectionTitle>Focus Session: Woman in K-Wave</SectionTitle>
          </div>
          <TrackSection track={focusSession} />
        </div>
      </div>

      {/* Program – Day tabs */}
      <div style={{ ...section }} id="program">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SectionLabel>Full Program</SectionLabel>
          <SectionTitle>Congress Schedule</SectionTitle>
        </div>
        {/* Tab buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          {days.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{
              padding: '10px 28px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.9rem', transition: 'all .2s',
              background: activeDay === i ? 'var(--kr-red)' : '#eee',
              color: activeDay === i ? '#fff' : '#333',
            }}>{d.label}</button>
          ))}
        </div>
        {/* Tracks for active day */}
        {days[activeDay].tracks.map((t, i) => (
          <TrackSection key={i} track={t} />
        ))}
      </div>
    </>
  );
}
