type Member = {
  name: string;
  role: string;
  title: string;
  affiliation: string;
  department?: string;
  country?: string;
  photo: string;
};

const ADVISORS: Member[] = [
  { name: 'Henry Jenkins', role: 'Advisor', title: 'Provost Prof.', affiliation: 'University of Southern California', department: 'Anneberg School for Communication & School of Cinematic Arts', country: 'USA', photo: '/members/henry-jenkins.jpg' },
  { name: 'Paul Lopes', role: 'Advisor', title: 'Prof.', affiliation: 'Colgate University', department: 'Sociology and Anthropology; Africana and Latin American Studies', country: 'USA', photo: '/members/paul-lopes.jpg' },
  { name: 'Ingyu Oh', role: 'Advisor', title: 'Prof.', affiliation: 'Kansai Gaidai University', country: 'Japan', photo: '/members/ingyu-oh.jpeg' },
];

const PRESIDENT: Member = {
  name: 'Taeseok Jeong', role: 'President', title: 'Prof.', affiliation: 'Jeonbuk National University', country: 'Korea', photo: '/members/taeseok-jeong.jpg',
};

const VPS_DIRECTORS: Member[] = [
  { name: 'Dong-Hoon Seol', role: 'Director of Academic Affairs', title: 'Prof.', affiliation: 'Jeonbuk National University', country: 'Korea', photo: '/members/dong-hoon-seol.png' },
  { name: 'Iksuk Kim', role: 'Director of Public Relations', title: 'Prof.', affiliation: 'California State University, Los Angeles', country: 'USA', photo: '/members/iksuk-kim.jpg' },
  { name: 'Sang-Myung Lee', role: 'Director of Finance', title: 'Prof.', affiliation: 'Hanyang University', country: 'Korea', photo: '/members/sang-myung-lee.jpg' },
  { name: 'Yeuntae Kim', role: 'Director of K-Medicine Affairs', title: 'Dr.', affiliation: 'B-Star Global', country: 'Korea', photo: '/members/yeuntae-kim.jpg' },
  { name: 'Hojin Kwon', role: 'Director of Hallyu Affairs', title: 'Dr.', affiliation: 'Seoul Broadcasting System Medianet', country: 'Korea', photo: '/members/hojin-kwon.jpg' },
  { name: 'Hyun Ki Kim', role: 'Director of Media Affairs', title: 'Dr.', affiliation: 'Korean Broadcasting System', country: 'Korea', photo: '/members/hyun-ki-kim.jpg' },
  { name: 'Tiger Kim', role: 'Director of Martial Arts Affairs', title: 'Dr.', affiliation: 'Korean American Association of the U.S.A.', country: 'USA', photo: '/members/tiger-kim.jpg' },
];

const SECRETARY: Member = {
  name: 'Hyeseon Hwang', role: 'Secretary General & CEO', title: '', affiliation: 'World Association for Hallyu Studies', country: 'Korea', photo: '/members/hyeseon-hwang.jpg',
};

const AUDITORS: Member[] = [
  { name: 'Yunsung Koh', role: 'Auditor', title: 'Prof.', affiliation: 'Hankuk University of Foreign Studies', country: 'Korea', photo: '/members/yunsung-koh.jpg' },
  { name: 'Giho Seo', role: 'Auditor', title: 'Mr.', affiliation: 'Whawoo Tax Firm', country: 'Korea', photo: '/members/giho-seo.jpg' },
];

const BOARD: Member[] = [
  { name: 'Jieun Kiaer', role: 'Board Member', title: 'Prof.', affiliation: 'University of Oxford', department: 'Editor, Hallyu', country: 'UK', photo: '/members/jieun-kiaer.jpeg' },
  { name: 'Rebecca Chiyoko King-O\'Riain', role: 'Board Member', title: 'Prof.', affiliation: 'Maynooth University', country: 'Ireland', photo: '/members/rebecca-king-oriain.jpg' },
  { name: 'Roald Maliangkay', role: 'Board Member', title: 'Prof.', affiliation: 'The Australian National University', country: 'Australia', photo: '/members/roald-maliangkay.jpeg' },
  { name: 'Chuyun Oh', role: 'Board Member', title: 'Prof.', affiliation: 'San Diego State University', department: 'CEO, Oniz Lab', country: 'USA', photo: '/members/chuyun-oh.jpg' },
  { name: 'Nissim Otmazgin', role: 'Board Member', title: 'Prof.', affiliation: 'The Hebrew University of Jerusalem', country: 'Israel', photo: '/members/nissim-otmazgin.jpg' },
  { name: 'Danielle O. Pyun', role: 'Board Member', title: 'Prof.', affiliation: 'Ohio State University', department: 'Assoc. Editor, Hallyu', country: 'USA', photo: '/members/danielle-pyun.jpg' },
  { name: 'Fabio La Rocca', role: 'Board Member', title: 'Assoc. Prof.', affiliation: 'Université Paul-Valéry Montpellier', department: 'Editor, Sociétés', country: 'France', photo: '/members/fabio-la-rocca.jpeg' },
  { name: 'Hye-Sook Wang', role: 'Board Member', title: 'Assoc. Prof.', affiliation: 'Brown University', country: 'USA', photo: '/members/hye-sook-wang.jpeg' },
  { name: 'Tom Baudinette', role: 'Board Member', title: 'Dr.', affiliation: 'Macquarie University', country: 'Australia', photo: '/members/tom-baudinette.jpg' },
  { name: 'Gamin Kang', role: 'Board Member', title: 'Dr.', affiliation: 'University of California, Los Angeles', country: 'USA', photo: '/members/gamin-kang.jpeg' },
  { name: 'Sarah Keith', role: 'Board Member', title: 'Dr.', affiliation: 'Macquarie University', country: 'Australia', photo: '/members/sarah-keith.jpg' },
  { name: 'Do Own (Donna) Kim', role: 'Board Member', title: 'Dr.', affiliation: 'University of Illinois, Chicago', country: 'USA', photo: '/members/do-own-kim.jpg' },
  { name: 'Olga Lazareva', role: 'Board Member', title: 'Dr.', affiliation: 'European University at St. Petersburg', country: 'Russia', photo: '/members/olga-lazareva.jpeg' },
  { name: 'Irina Lyan', role: 'Board Member', title: 'Dr.', affiliation: 'The Hebrew University of Jerusalem', country: 'Israel', photo: '/members/irina-lyan.jpg' },
  { name: 'Yun Jung Im Park', role: 'Board Member', title: 'Dr.', affiliation: 'University of São Paulo', country: 'Brazil', photo: '/members/yun-jung-im-park.jpg' },
  { name: 'Meicheng Sun', role: 'Board Member', title: 'Dr.', affiliation: 'Beijing Language and Culture University', country: 'China', photo: '/members/meicheng-sun.png' },
  { name: 'Haekyung Um', role: 'Board Member', title: 'Dr.', affiliation: 'University of Liverpool', country: 'UK', photo: '/members/haekyung-um.jpg' },
];

function MemberCard({ member, detailed = false }: { member: Member; detailed?: boolean }) {
  return (
    <div className="committee-card">
      <div className="committee-photo-wrap">
        <img src={member.photo} alt={member.name} style={member.name === 'Yun Jung Im Park' ? { objectPosition: 'center 20%' } : undefined} />
      </div>
      <div className="committee-card-body">
        <div className="committee-role">{member.role}</div>
        <div className="committee-name">{member.title ? `${member.title} ` : ''}{member.name}</div>
        <div className="committee-affil">{member.affiliation}{member.country ? `, ${member.country}` : ''}</div>
        {detailed && member.department && <div className="committee-dept">{member.department}</div>}
      </div>
    </div>
  );
}

function CommitteeGroup({ title, members, featured = false, detailed = false }: { title: string; members: Member[]; featured?: boolean; detailed?: boolean }) {
  return (
    <div className="committee-group">
      <h3 className="committee-group-title">{title}</h3>
      <div className={`committee-grid${featured ? ' committee-grid-featured' : ''}`}>
        {members.map((m) => <MemberCard key={m.name} member={m} detailed={detailed} />)}
      </div>
    </div>
  );
}

export { ADVISORS, PRESIDENT, VPS_DIRECTORS, SECRETARY, AUDITORS, BOARD, CommitteeGroup, MemberCard };

export default function Committee({ detailed = false, noReveal = false }: { detailed?: boolean; noReveal?: boolean } = {}) {
  return (
    <section className="committee-section" id="committee">
      <div className={`section-inner${noReveal ? '' : ' reveal'}`}>
        <span className="section-label">Our Team</span>
        <h2 className="section-title">Executive Committee</h2>
        <p className="section-lead">The scholars and practitioners leading WAHS and shaping Hallyu studies globally.</p>

        <CommitteeGroup title="President" members={[PRESIDENT]} featured detailed={detailed} />
        <CommitteeGroup title="Advisors" members={ADVISORS} detailed={detailed} />
        <CommitteeGroup title="Vice Presidents & Directors" members={VPS_DIRECTORS} detailed={detailed} />
        <CommitteeGroup title="Secretary General" members={[SECRETARY]} featured detailed={detailed} />
        <CommitteeGroup title="Auditors" members={AUDITORS} detailed={detailed} />
        <CommitteeGroup title="International Board Members" members={BOARD} detailed={detailed} />
      </div>
    </section>
  );
}
