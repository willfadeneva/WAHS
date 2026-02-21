import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
import Speakers from '@/components/Speakers';
import Tracks from '@/components/Tracks';
import Timeline from '@/components/Timeline';
import Venue from '@/components/Venue';
import Publications from '@/components/Publications';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Congress2022 from '@/components/Congress2022';

// Mock data for the Congress
const congressData = {
  year: 2026,
  title: 'Cultural Dynamism in the Digital Age',
  subtitle: 'Toward a Universal Theory of Pop Culture Globalization',
  theme: 'Cultural Dynamism',
  dates: 'May 28–30, 2026',
  venue: 'Cheju Halla University',
  location: 'Jeju Island, South Korea',
  submission_deadline: 'March 31, 2026',
  early_bird_deadline: 'May 15, 2026',
  video_url: 'https://www.youtube.com/embed/sample',
  is_active: true,
  is_archived: false,
  tracks: [
    {
      number: '1',
      title: 'Cultural Dynamism',
      subtitle: 'Annual Theme',
      topics: [
        'Platform capitalism and digital circulation',
        'Gender politics and female universalism',
        'Production systems and business models',
        'Fandom practices and participatory culture',
        'Postcolonial positioning and geopolitical contexts',
        'Transmedia storytelling and IP management',
        'Comparative cases beyond Korea',
        'Methodological innovations'
      ]
    },
    {
      number: '2',
      title: 'Open Topics in Hallyu Studies',
      subtitle: 'All Topics Welcome',
      topics: [
        'K-pop, K-drama, Film, Webtoons, Gaming',
        'Regional reception studies',
        'Language learning and Korean studies',
        'Cultural policy and soft power',
        'Tourism and place branding',
        'Consumption practices',
        'Authenticity and cultural translation'
      ]
    }
  ],
  pricing: [
    {
      tier: 'Regular',
      amount: '$300',
      early_bird: '$250',
      features: ['Full conference access', 'Conference materials', 'Lunch & coffee breaks', 'Welcome reception'],
      featured: false
    },
    {
      tier: 'Student',
      amount: '$150',
      early_bird: '$120',
      features: ['Full conference access', 'Conference materials', 'Lunch & coffee breaks'],
      featured: false
    },
    {
      tier: 'WAHS Member',
      amount: '$250',
      early_bird: '$200',
      features: ['Full conference access', 'Conference materials', 'Lunch & coffee breaks', 'Welcome reception', 'Member networking event'],
      featured: true
    },
    {
      tier: 'Virtual',
      amount: '$100',
      early_bird: '$80',
      features: ['Virtual conference access', 'Digital materials', 'Online networking'],
      featured: false
    }
  ],
  publications: [
    {
      badge: 'A&HCI',
      badge_class: 'indexed',
      title: 'SOCIÉTÉS',
      desc: 'Peer-reviewed, A&HCI indexed journal (special issue)'
    },
    {
      badge: 'WAHS',
      badge_class: 'wahs',
      title: 'HALLYU',
      desc: 'WAHS flagship journal (special issue)'
    },
    {
      badge: 'Brill',
      badge_class: 'publisher',
      title: 'BRILL',
      desc: 'Leading academic publisher (edited volume)'
    },
    {
      badge: 'OA',
      badge_class: 'open',
      title: 'Congress Proceedings',
      desc: 'Open access publication of selected papers'
    }
  ]
};

// Mock speakers data
const speakersData = [
  {
    id: '1',
    name: 'Dr. Kim Jiyoung',
    role: 'Director, Korean Culture Institute',
    affiliation: 'Seoul National University',
    image_url: '/speakers/kim-jiyoung.jpg',
    bio: 'Leading scholar in cultural policy and soft power studies with over 20 years of research experience.',
    sort_order: 1,
    is_plenary: true
  },
  {
    id: '2',
    name: 'Prof. Lee Minho',
    role: 'Chair of Media Studies',
    affiliation: 'Yonsei University',
    image_url: '/speakers/lee-minho.jpg',
    bio: 'Expert in digital platforms and media circulation in East Asian contexts.',
    sort_order: 2,
    is_plenary: true
  },
  {
    id: '3',
    name: 'Dr. Park Sooyoung',
    role: 'Research Fellow',
    affiliation: 'Harvard Korea Institute',
    image_url: '/speakers/park-sooyoung.jpg',
    bio: 'Specialist in transnational fandom and participatory culture studies.',
    sort_order: 3,
    is_plenary: false
  },
  {
    id: '4',
    name: 'Prof. Choi Young',
    role: 'Department Head',
    affiliation: 'University of Tokyo',
    image_url: '/speakers/choi-young.jpg',
    bio: 'Pioneer in regional reception studies of Korean popular culture.',
    sort_order: 4,
    is_plenary: false
  }
];

export default function CongressPage({ params }: { params: { year: string } }) {
  const year = params.year;
  
  // Update congress data with correct year
  const congress = {
    ...congressData,
    year: parseInt(year),
    dates: `May 28–30, ${year}`,
    submission_deadline: `March 31, ${year}`,
    early_bird_deadline: `May 15, ${year}`
  };

  return (
    <div className="congress-page">
        <Hero congress={congress} />
        
        <Overview congress={congress} />
        
        <Speakers speakers={speakersData} />
        
        <Tracks tracks={congress.tracks} />
        
        <Timeline congress={congress} />
        
        <Venue congress={congress} />
        
        <Publications publications={congress.publications} />
        
        <Congress2022 />
        
        <CTA congress={congress} year={congress.year} />
        
        <Footer />
    </div>
  );
}