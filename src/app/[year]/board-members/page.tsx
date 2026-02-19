import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { ADVISORS, PRESIDENT, VPS_DIRECTORS, SECRETARY, AUDITORS, BOARD } from '@/components/Committee';

function Card({ member }: { member: { name: string; role: string; title: string; affiliation: string; department?: string; country?: string; photo: string } }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '28px 16px 24px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
    }}>
      <div style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        overflow: 'hidden',
        margin: '0 auto 14px',
        border: '2px solid rgba(205,46,58,0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <img src={member.photo} alt={member.name} style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          display: 'block',
        }} />
      </div>
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#CD2E3A', marginBottom: '6px', opacity: 0.8 }}>
        {member.role}
      </div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
        {member.title ? `${member.title} ` : ''}{member.name}
      </div>
      <div style={{ fontSize: '0.78rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.4)' }}>
        {member.affiliation}{member.country ? `, ${member.country}` : ''}
      </div>
      {member.department && (
        <div style={{ fontSize: '0.72rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', marginTop: '4px' }}>
          {member.department}
        </div>
      )}
    </div>
  );
}

function Group({ title, members, featured = false }: { title: string; members: any[]; featured?: boolean }) {
  return (
    <div style={{ marginTop: '56px' }}>
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '1.25rem',
        color: '#CD2E3A',
        textAlign: 'center',
        marginBottom: '28px',
        letterSpacing: '1px',
      }}>{title}</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: featured ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        maxWidth: featured ? '320px' : '1200px',
        margin: '0 auto',
      }}>
        {members.map((m) => <Card key={m.name} member={m} />)}
      </div>
    </div>
  );
}

export default async function BoardMembersPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  return (
    <>
      <MainNav />
      <section style={{
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%)',
        padding: '160px 24px 100px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#CD2E3A' }}>Our Team</span>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', margin: '12px 0 20px' }}>Board Members</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', maxWidth: '720px', margin: '0 auto 48px' }}>
            The scholars and practitioners leading WAHS and shaping Hallyu studies globally.
          </p>

          <Group title="President" members={[PRESIDENT]} featured />
          <Group title="Advisors" members={ADVISORS} />
          <Group title="Vice Presidents & Directors" members={VPS_DIRECTORS} />
          <Group title="Secretary General" members={[SECRETARY]} featured />
          <Group title="Auditors" members={AUDITORS} />
          <Group title="International Board Members" members={BOARD} />
        </div>
      </section>
      <MainFooter />
    </>
  );
}
