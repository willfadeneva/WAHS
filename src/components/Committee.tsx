type Member = {
  name: string;
  role: string;
  title: string;
  affiliation: string;
  photo: string;
};

const ADVISORS: Member[] = [
  { name: 'Henry Jenkins', role: 'Advisor', title: 'Prof.', affiliation: 'University of Southern California', photo: '/members/henry-jenkins.jpg' },
  { name: 'Paul Lopes', role: 'Advisor', title: 'Prof.', affiliation: 'Colgate University', photo: '/members/paul-lopes.jpg' },
  { name: 'Ingyu Oh', role: 'Advisor', title: 'Prof.', affiliation: 'Kansai Gaidai University', photo: '/members/ingyu-oh.jpeg' },
];

const PRESIDENT: Member = {
  name: 'Taeseok Jeong', role: 'President', title: 'Prof.', affiliation: 'Jeonbuk National University', photo: '/members/taeseok-jeong.jpg',
};

const VPS_DIRECTORS: Member[] = [
  { name: 'Dong-Hoon Seol', role: 'Academic Affairs', title: 'Prof.', affiliation: '', photo: '/members/dong-hoon-seol.png' },
  { name: 'Iksuk Kim', role: 'Public Relations', title: 'Prof.', affiliation: '', photo: '/members/iksuk-kim.jpg' },
  { name: 'Sang-Myung Lee', role: 'Finance', title: 'Prof.', affiliation: '', photo: '/members/sang-myung-lee.jpg' },
  { name: 'Yeuntae Kim', role: 'K-Medicine Affairs', title: 'Dr.', affiliation: '', photo: '/members/yeuntae-kim.jpg' },
  { name: 'Hojin Kwon', role: 'Hallyu Affairs', title: 'Dr.', affiliation: '', photo: '/members/hojin-kwon.jpg' },
  { name: 'Hyun Ki Kim', role: 'Media Affairs', title: 'Dr.', affiliation: '', photo: '/members/hyun-ki-kim.jpg' },
  { name: 'Tiger Kim', role: 'Martial Arts Affairs', title: 'Dr.', affiliation: '', photo: '/members/tiger-kim.jpg' },
];

const SECRETARY: Member = {
  name: 'Hyeseon Hwang', role: 'Secretary General & CEO', title: '', affiliation: 'WAHS, Korea', photo: '/members/hyeseon-hwang.jpg',
};

const AUDITORS: Member[] = [
  { name: 'Yunsung Koh', role: 'Auditor', title: 'Prof.', affiliation: 'Hankuk Univ. of Foreign Studies', photo: '/members/yunsung-koh.jpg' },
  { name: 'Giho Seo', role: 'Auditor', title: 'Mr.', affiliation: 'Whawoo Tax Firm', photo: '/members/giho-seo.jpg' },
];

const BOARD: Member[] = [
  { name: 'Jieun Kiaer', role: 'Board Member', title: 'Prof.', affiliation: 'University of Oxford', photo: '/members/jieun-kiaer.jpeg' },
  { name: 'Rebecca King-O\'Riain', role: 'Board Member', title: 'Prof.', affiliation: 'Maynooth University', photo: '/members/rebecca-king-oriain.jpg' },
  { name: 'Roald Maliangkay', role: 'Board Member', title: 'Prof.', affiliation: 'Australian National Univ.', photo: '/members/roald-maliangkay.jpeg' },
  { name: 'Chuyun Oh', role: 'Board Member', title: 'Prof.', affiliation: 'San Diego State Univ.', photo: '/members/chuyun-oh.jpg' },
  { name: 'Nissim Otmazgin', role: 'Board Member', title: 'Prof.', affiliation: 'Hebrew Univ. Jerusalem', photo: '/members/nissim-otmazgin.jpg' },
  { name: 'Danielle Pyun', role: 'Board Member', title: 'Prof.', affiliation: 'Ohio State University', photo: '/members/danielle-pyun.jpg' },
  { name: 'Fabio La Rocca', role: 'Board Member', title: 'Assoc. Prof.', affiliation: 'Univ. Montpellier', photo: '/members/fabio-la-rocca.jpeg' },
  { name: 'Hye-Sook Wang', role: 'Board Member', title: 'Assoc. Prof.', affiliation: 'Brown University', photo: '/members/hye-sook-wang.jpeg' },
  { name: 'Tom Baudinette', role: 'Board Member', title: 'Dr.', affiliation: 'Macquarie University', photo: '/members/tom-baudinette.jpg' },
  { name: 'Gamin Kang', role: 'Board Member', title: 'Dr.', affiliation: 'University of California, Los Angeles', photo: '/members/gamin-kang.jpeg' },
  { name: 'Sarah Keith', role: 'Board Member', title: 'Dr.', affiliation: 'Macquarie University', photo: '/members/sarah-keith.jpg' },
  { name: 'Do Own Kim', role: 'Board Member', title: 'Dr.', affiliation: 'Univ. of Illinois Chicago', photo: '/members/do-own-kim.jpg' },
  { name: 'Olga Lazareva', role: 'Board Member', title: 'Dr.', affiliation: 'European Univ. at St. Petersburg', photo: '/members/olga-lazareva.jpeg' },
  { name: 'Irina Lyan', role: 'Board Member', title: 'Dr.', affiliation: 'Hebrew Univ. Jerusalem', photo: '/members/irina-lyan.jpg' },
  { name: 'Yun Jung Im Park', role: 'Board Member', title: 'Dr.', affiliation: 'Univ. of São Paulo', photo: '/members/yun-jung-im-park.jpg' },
  { name: 'Meicheng Sun', role: 'Board Member', title: 'Dr.', affiliation: 'Beijing Lang. & Culture Univ.', photo: '/members/meicheng-sun.png' },
  { name: 'Haekyung Um', role: 'Board Member', title: 'Dr.', affiliation: 'University of Liverpool', photo: '/members/haekyung-um.jpg' },
];

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="committee-card">
      <div className="committee-photo-wrap">
        <img src={member.photo} alt={member.name} />
      </div>
      <div className="committee-card-body">
        <div className="committee-role">{member.role}</div>
        <div className="committee-name">{member.title ? `${member.title} ` : ''}{member.name}</div>
        {member.affiliation && <div className="committee-affil">{member.affiliation}</div>}
      </div>
    </div>
  );
}

export default function Committee() {
  return (
    <section className="committee-section" id="committee">
      <div className="section-inner reveal">
        <span className="section-label">Our Team</span>
        <h2 className="section-title">Executive Committee</h2>
        <p className="section-lead">The scholars and practitioners leading WAHS and shaping Hallyu studies globally.</p>

        {/* President */}
        <div className="committee-group">
          <h3 className="committee-group-title">President</h3>
          <div className="committee-grid committee-grid-featured">
            <MemberCard member={PRESIDENT} />
          </div>
        </div>

        {/* Advisors */}
        <div className="committee-group">
          <h3 className="committee-group-title">Advisors</h3>
          <div className="committee-grid">
            {ADVISORS.map((m) => <MemberCard key={m.name} member={m} />)}
          </div>
        </div>

        {/* Vice Presidents & Directors */}
        <div className="committee-group">
          <h3 className="committee-group-title">Vice Presidents &amp; Directors</h3>
          <div className="committee-grid">
            {VPS_DIRECTORS.map((m) => <MemberCard key={m.name} member={m} />)}
          </div>
        </div>

        {/* Secretary General */}
        <div className="committee-group">
          <h3 className="committee-group-title">Secretary General</h3>
          <div className="committee-grid committee-grid-featured">
            <MemberCard member={SECRETARY} />
          </div>
        </div>

        {/* Auditors */}
        <div className="committee-group">
          <h3 className="committee-group-title">Auditors</h3>
          <div className="committee-grid">
            {AUDITORS.map((m) => <MemberCard key={m.name} member={m} />)}
          </div>
        </div>

        {/* International Board */}
        <div className="committee-group">
          <h3 className="committee-group-title">International Board Members</h3>
          <div className="committee-grid">
            {BOARD.map((m) => <MemberCard key={m.name} member={m} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
