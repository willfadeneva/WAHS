import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import Committee from '@/components/Committee';

export default async function BoardMembersPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  return (
    <>
      <Nav year={year} />
      <div style={{ paddingTop: '80px' }}>
        <Committee detailed />
      </div>
      <Footer />
      <ScrollReveal />
    </>
  );
}
