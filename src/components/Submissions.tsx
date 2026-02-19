import SubmissionForm from './SubmissionForm';

const types = [
  { type: 'Individual Paper', words: '300–500 words', desc: '20-minute presentation' },
  { type: 'Full Panel', words: '800–1,000 words', desc: '3–4 papers, 90-minute session' },
  { type: 'Roundtable', words: '500–700 words', desc: '4–6 participants' },
  { type: 'Workshop', words: '500–700 words', desc: 'Hands-on methodology' },
];

export default function Submissions() {
  return (
    <section className="submissions" id="submissions">
      <div className="section-inner reveal">
        <span className="section-label">Call for Papers</span>
        <h2 className="section-title">Submit Your Abstract</h2>
        <p className="section-lead">We welcome diverse formats to accommodate different modes of scholarly engagement and exchange.</p>
        <div className="submission-types-row">
          {types.map((t, i) => (
            <div className="submission-card" key={i}>
              <div className="submission-type">{t.type}</div>
              <div className="submission-words">{t.words}</div>
              <div className="submission-desc">{t.desc}</div>
            </div>
          ))}
        </div>
        <div className="submission-requirements">
          <h3 className="submission-requirements-title">Submission Requirements</h3>
          <p className="submission-requirements-text">
            All submissions must include: author name(s), affiliation(s), and email; presentation or panel title; track selection (1 or 2); 5–7 keywords; brief bio (100 words per presenter); and any special requirements. Submit in English using Chicago or APA citation style.
          </p>
        </div>
        <SubmissionForm />
      </div>
    </section>
  );
}
