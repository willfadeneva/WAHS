import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScrollReveal from '@/components/ScrollReveal';

const HISTORY = [
  { year: 2025, events: ['Oct. 31 — Inauguration of the 4th President Prof. Taeseok Jeong; Appointment of new board members; Fall Conference at Jeonbuk National University'] },
  { year: 2024, events: ['The 11th World Congress (Seoul) — Youngone Hall, Seoul National University Asia Center (SNUAC)'] },
  { year: 2023, events: ['The 10th World Congress (Paris) — M Social Hotel Paris'] },
  { year: 2022, events: ['Inauguration of the 3rd President Siyeun Moon', 'The 9th World Congress (Seoul) — National Library of Korea'] },
  { year: 2021, events: ['Sep. 13 — The 8th World Congress for Hallyu (Oxford, Online) — Kellogg College, University of Oxford. Theme: Coronavirus and Pop Culture'] },
  { year: 2020, events: ['All activities cancelled due to Coronavirus'] },
  { year: 2019, events: ['Jan. 20 — The 7th World Congress for Hallyu (Jerusalem) — Hebrew University of Jerusalem'] },
  { year: 2018, events: ['Nov. 16 — The 6th World Congress for Hallyu (Osaka) — Kansai Gaidai University', 'Jan. 30 — The 5th General Assembly and Board of Directors', 'Jan. 30 — The 5th World Congress for Hallyu (Seoul)'] },
  { year: 2017, events: ['Sep. 20 — The 5th World Congress for Hallyu (Seoul) — University of Seoul', 'Jan. 25 — The 4th General Assembly and Board of Directors'] },
  { year: 2016, events: ['Sep. 26 — The 4th World Congress for Hallyu (Oxford) — Oriel College, University of Oxford', 'Sep. — The 4th WAHS Essay/Article Contest', 'Sep. — The 1st Hallyu Video Contest', 'Jan. 27 — The 3rd General Assembly and Forum'] },
  { year: 2015, events: ['Nov. 03 — The 3rd World Congress for Hallyu (Dubai) — International Convention Center', 'Nov. — The 3rd WAHS Essay/Article Contest', 'Oct. 14 — Seminar on Korea–France Cultural Exchanges: 2015 The New Korean Pop Culture', 'June 19 — Joining of Hallyu Strategy Council', 'May 23 — Seminar on K-Design Sponsorship', 'Jan. 26 — The 2nd General Assembly'] },
  { year: 2014, events: ['Oct. 31 — The 2nd World Congress for Hallyu (Argentina) — National Library', 'Oct. — The 2nd WAHS Essay/Article Contest', 'Oct. 10 — The Strategy Study Conference for Hallyu', 'Jul. 15 — WAHS and MOFA signed the Framework of Cooperation', 'Feb. 10 — Hallyu Conference (Argentina)', 'Jan. 20 — The 1st General Assembly and Forum'] },
  { year: 2013, events: ['Oct. 18 — The 1st World Congress for Hallyu (Seoul) — Korea University', 'Oct. — The 1st WAHS Essay/Article Contest', 'Aug. 19 — Global branches established', 'May 07 — Hallyu Conference (Middle East Branch / Hebrew University)', 'Mar. 29 — Incorporation and Registration', 'Mar. 11 — Permission of Incorporation from the Ministry of Culture, Sports and Tourism in Korea', 'Jan. 28 — Founding General Meeting (Daewoo Foundation Bldg.)'] },
  { year: 2012, events: ['Oct. 24 — The 1st General Meeting of Incorporators (Conference House Dalgaebi)', 'Jul. 10 — The 1st Meeting of Incorporators'] },
];

export default async function HistoryPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  return (
    <>
      <MainNav />
      <div style={{ paddingTop: '80px', background: 'var(--cream)' }}><Breadcrumbs /></div>
      <section className="history-section" style={{ paddingTop: '40px' }}>
        <div className="section-inner reveal">
          <span className="section-label">About WAHS</span>
          <h2 className="section-title">Our History</h2>
          <p className="section-lead">From a founding meeting in 2012 to a global network of scholars — the story of the World Association for Hallyu Studies.</p>

          <div className="history-timeline">
            {HISTORY.map((h) => (
              <div className="history-year-block" key={h.year}>
                <div className="history-year-marker">
                  <span className="history-year-dot" />
                  <span className="history-year-label">{h.year}</span>
                </div>
                <div className="history-events">
                  {h.events.map((e, i) => (
                    <div className="history-event" key={i}>{e}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MainFooter />
      <ScrollReveal />
    </>
  );
}
