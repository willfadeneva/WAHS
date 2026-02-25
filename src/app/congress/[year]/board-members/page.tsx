import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Breadcrumbs from '@/components/Breadcrumbs';

const sections = [
  {
    title: 'Advisors',
    members: [
      { title: 'Provost Prof.', name: 'Henry Jenkins', lines: ['Anneberg School for Communication', 'School of Cinematic Arts', 'University of Southern California'] },
      { title: 'Prof.', name: 'Ingyu Oh', lines: ['Kansai Gaidai University, Japan'] },
      { title: 'Prof.', name: 'Paul Lopes', lines: ['Sociology and Anthropology', 'Africana and Latin American Studies', 'Colgate University'] },
    ],
  },
  {
    title: 'President',
    members: [
      { title: 'Prof.', name: 'Taeseok Jeong', lines: ['Jeonbuk National University, Korea'] },
    ],
  },
  {
    title: 'Vice Presidents and Directors',
    members: [
      { title: 'Prof.', name: 'Dong-Hoon Seol', role: 'Director of Academic Affairs', lines: ['Jeonbuk National University, Korea'] },
      { title: 'Prof.', name: 'Iksuk Kim', role: 'Director of Public Relations', lines: ['California State University, Los Angeles, USA'] },
      { title: 'Prof.', name: 'Sang-Myung Lee', role: 'Director of Finance', lines: ['Hanyang University, Korea'] },
      { title: 'Dr.', name: 'Yeuntae Kim', role: 'Director of K-Medicine Affairs', lines: ['B-Star Global, Korea'] },
      { title: 'Dr.', name: 'Hojin Kwon', role: 'Director of Hallyu Affairs', lines: ['Seoul Broadcasting System Medianet, Korea'] },
      { title: 'Dr.', name: 'Hyun Ki Kim', role: 'Director of Media Affairs', lines: ['Korean Broadcasting System, Korea'] },
      { title: 'Dr.', name: 'Tiger Kim', role: 'Director of Martial Arts Affairs', lines: ['Korean American Association of the U.S.A.'] },
    ],
  },
  {
    title: 'Secretary General & CEO',
    members: [
      { title: '', name: 'Hyeseon Hwang', lines: ['World Association for Hallyu Studies, Korea'] },
    ],
  },
  {
    title: 'Auditors',
    members: [
      { title: 'Prof.', name: 'Yunsung Koh', lines: ['Hankuk University of Foreign Studies, Korea'] },
      { title: 'Mr.', name: 'Giho Seo', lines: ['Whawoo Tax Firm, Korea'] },
    ],
  },
  {
    title: 'International Board Members',
    members: [
      { title: 'Prof.', name: 'Jieun Kiaer', lines: ['University of Oxford (Editor, Hallyu), UK'] },
      { title: 'Professor', name: 'Rebecca Chiyoko King-O\'Riain', lines: ['Maynooth University, Ireland'] },
      { title: 'Prof.', name: 'Roald Maliangkay', lines: ['The Australian National University, Australia'] },
      { title: 'Prof.', name: 'Chuyun Oh', lines: ['San Diego State University; CEO, Oniz Lab, USA'] },
      { title: 'Prof.', name: 'Nissim Otmazgin', lines: ['The Hebrew University of Jerusalem, Israel'] },
      { title: 'Prof.', name: 'Danielle O. Pyun', lines: ['Ohio State University (Assoc Editor, Hallyu), USA'] },
      { title: 'Assoc. Prof.', name: 'Fabio La Rocca', lines: ['Université Paul-Valéry Montpellier (Editor, Sociétés), France'] },
      { title: 'Assoc. Prof.', name: 'Hye-Sook Wang', lines: ['Brown University, USA'] },
      { title: 'Dr.', name: 'Tom Baudinette', lines: ['Macquarie University, Australia'] },
      { title: 'Dr.', name: 'Gamin Kang', lines: ['University of California, Los Angeles, USA'] },
      { title: 'Dr.', name: 'Sarah Keith', lines: ['Macquarie University, Australia'] },
      { title: 'Dr.', name: 'Do Own (Donna) Kim', lines: ['University of Illinois, Chicago, USA'] },
      { title: 'Dr.', name: 'Olga Lazareva', lines: ['European University at St. Petersburg, Russia'] },
      { title: 'Dr.', name: 'Irina Lyan', lines: ['The Hebrew University of Jerusalem, Israel'] },
      { title: 'Dr.', name: 'Yun Jung Im Park', lines: ['University of São Paulo, Brazil'] },
      { title: 'Dr.', name: 'Meicheng Sun', lines: ['Beijing Language and Culture University, China'] },
      { title: 'Dr.', name: 'Haekyung Um', lines: ['University of Liverpool, UK'] },
    ],
  },
];

export default async function BoardMembersPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  return (
    <>
      <MainNav />
      <div style={{ paddingTop: '80px' }}><Breadcrumbs /></div>
      <section style={{ background: '#fff', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', color: '#000', marginBottom: '48px', textAlign: 'center' }}>Board Members</h1>

          {sections.map((s) => (
            <div key={s.title} style={{ marginBottom: '40px' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: '#000', borderBottom: '2px solid #CD2E3A', paddingBottom: '8px', marginBottom: '24px' }}>{s.title}</h3>
              {s.members.map((m) => (
                <div key={m.name} style={{ marginBottom: '20px' }}>
                  {(m as any).role && <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>{(m as any).role}</div>}
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#000' }}>{m.title ? `${m.title} ` : ''}{m.name}</div>
                  {m.lines.map((line, i) => (
                    <div key={i} style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>{line}</div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <MainFooter />
    </>
  );
}
