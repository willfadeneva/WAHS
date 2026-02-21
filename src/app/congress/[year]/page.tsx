import Nav from '@/components/Nav';
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

// Mock speakers data - using actual speaker photos that exist
const speakersData = [
  {
    id: '1',
    name: 'Henry Jenkins',
    role: 'Provost Professor of Communication, Journalism, Cinematic Arts and Education',
    affiliation: 'University of Southern California',
    image_url: '/speakers/henry-jenkins.jpg',
    bio: 'Leading media scholar known for work on participatory culture, convergence, and fandom studies.',
    sort_order: 1,
    is_plenary: true
  },
  {
    id: '2',
    name: 'Jieun Kiaer',
    role: 'Professor of Korean Language and Linguistics',
    affiliation: 'University of Oxford',
    image_url: '/speakers/jieun-kiaer.jpg',
    bio: 'Expert in Korean linguistics, translation studies, and Hallyu language phenomena.',
    sort_order: 2,
    is_plenary: true
  },
  {
    id: '3',
    name: 'Roald Maliangkay',
    role: 'Associate Professor of Korean Studies',
    affiliation: 'Australian National University',
    image_url: '/speakers/roald-maliangkay.jpg',
    bio: 'Specialist in Korean popular music, cultural policy, and heritage studies.',
    sort_order: 3,
    is_plenary: false
  },
  {
    id: '4',
    name: 'Ingyu Oh',
    role: 'Professor of Business and Management',
    affiliation: 'Korea University',
    image_url: '/speakers/ingyu-oh.jpg',
    bio: 'Focuses on business models, creative industries, and Hallyu economics.',
    sort_order: 4,
    is_plenary: false
  },
  {
    id: '5',
    name: 'Rob Kutner',
    role: 'Writer and Producer',
    affiliation: 'The Daily Show, Conan',
    image_url: '/speakers/rob-kutner.jpg',
    bio: 'Emmy-winning comedy writer with expertise in satire and pop culture commentary.',
    sort_order: 5,
    is_plenary: false
  },
  {
    id: '6',
    name: 'Marlene Sharp',
    role: 'Entertainment Attorney and Producer',
    affiliation: 'Sharp Entertainment Law',
    image_url: '/speakers/marlene-sharp.jpg',
    bio: 'Specializes in entertainment law, intellectual property, and media production.',
    sort_order: 6,
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
      <Nav year={congress.year} />
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