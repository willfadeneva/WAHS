import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import ScrollReveal from '@/components/ScrollReveal';
import Committee from '@/components/Committee';

export default async function BoardMembersPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  return (
    <>
      <MainNav />
      <div style={{ paddingTop: '80px' }}>
        <Committee detailed noReveal />
      </div>
      <MainFooter />
      <ScrollReveal />
    </>
  );
}
