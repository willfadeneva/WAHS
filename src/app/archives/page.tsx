import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import ScrollReveal from '@/components/ScrollReveal';

interface ArchivePost {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  description: string;
  image?: string;
  link?: string;
}

const archivedPosts: ArchivePost[] = [
  {
    id: 'female-universalism-2026',
    title: 'Female Universalism: Book Launch Seminar',
    date: '2026-05-27',
    dateLabel: 'May 27–28, 2026',
    description:
      'Book Launch Seminar for "Female Universalism: Gender, Melancholia, and Radical Empathy in the Korean Wave" hosted by SNU Asia Center Civil Society Program and sponsored by WAHS.',
    image: '/female-universalism-poster.jpg',
    link: '/female-universalism-poster.jpg',
  },
];

function groupByYear(posts: ArchivePost[]) {
  const groups: Record<string, ArchivePost[]> = {};
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    if (!groups[year]) groups[year] = [];
    groups[year].push(post);
  }
  // Sort years descending
  return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
}

export default function ArchivesPage() {
  const grouped = groupByYear(archivedPosts);

  return (
    <div className="main-page">
      <MainNav />

      <section className="archives-hero">
        <div className="archives-hero-inner">
          <h1 className="archives-title">Archives</h1>
          <p className="archives-subtitle">
            Past events, posters, and announcements from the World Association for Hallyu Studies.
          </p>
        </div>
      </section>

      <section className="archives-content">
        <div className="archives-inner">
          {grouped.length === 0 ? (
            <p className="archives-empty">No archived posts yet.</p>
          ) : (
            grouped.map(([year, posts]) => (
              <div key={year} className="archives-year-group">
                <h2 className="archives-year-heading">{year}</h2>
                <div className="archives-posts">
                  {posts.map((post) => (
                    <article key={post.id} className="archives-post">
                      {post.image && (
                        <a
                          href={post.link || post.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="archives-post-image-link"
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="archives-post-image"
                          />
                        </a>
                      )}
                      <div className="archives-post-body">
                        <time className="archives-post-date">{post.dateLabel}</time>
                        <h3 className="archives-post-title">
                          {post.link ? (
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {post.title}
                            </a>
                          ) : (
                            post.title
                          )}
                        </h3>
                        <p className="archives-post-desc">{post.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <MainFooter />
      <ScrollReveal />
    </div>
  );
}
