'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Simple components to replace imports
const SimpleHero = ({ year }: { year: string }) => (
  <section className="hero-section" style={{ 
    background: 'linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%)',
    padding: '140px 24px 100px',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    }}>
      <div style={{ 
        fontSize: '1.4rem', 
        opacity: 0.9, 
        marginBottom: '15px',
        letterSpacing: '3px'
      }}>
        세계한류학회
      </div>
      <h1 style={{ 
        fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
        marginBottom: '25px', 
        fontWeight: '800',
        lineHeight: 1.1
      }}>
        WORLD CONGRESS<br />FOR HALLYU STUDIES {year}
      </h1>
      <div style={{ 
        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
        marginBottom: '15px',
        fontWeight: '300',
        opacity: 0.95
      }}>
        Cultural Dynamism in the Digital Age
      </div>
      <div style={{ 
        fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', 
        marginBottom: '40px',
        fontWeight: '600',
        color: '#FFD700'
      }}>
        Toward a Universal Theory of Pop Culture Globalization
      </div>
      <div style={{ 
        fontSize: '1.6rem', 
        marginBottom: '10px', 
        fontWeight: '500',
        letterSpacing: '1px'
      }}>
        MAY 28–30, {year}
      </div>
      <div style={{ 
        fontSize: '1.2rem', 
        marginBottom: '60px',
        opacity: 0.9,
        letterSpacing: '0.5px'
      }}>
        CHEJU HALLA UNIVERSITY, JEJU ISLAND, SOUTH KOREA
      </div>
      
      {/* CTA Buttons */}
      <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href={`/congress/${year}/submissions-new`}
          style={{
            background: '#0047A0',
            color: 'white',
            border: 'none',
            padding: '18px 40px',
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.3s',
            boxShadow: '0 4px 20px rgba(0, 71, 160, 0.3)'
          }}
          className="hover-button-blue"
        >
          📝 Submit Abstract
        </Link>
        <Link
          href={`/congress/${year}/registration`}
          style={{
            background: '#CD2E3A',
            color: 'white',
            border: 'none',
            padding: '18px 40px',
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.3s',
            boxShadow: '0 4px 20px rgba(205, 46, 58, 0.3)'
          }}
          className="hover-button-red"
        >
          🎫 Register for Congress
        </Link>
      </div>
    </div>
    
    {/* Decorative elements */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      zIndex: 1
    }}></div>
  </section>
);

const SimpleOverview = () => (
  <section style={{ 
    padding: '100px 24px',
    background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)'
  }}>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        color: '#0047A0', 
        marginBottom: '30px',
        textAlign: 'center',
        fontWeight: '700'
      }}>
        CONFERENCE OVERVIEW
      </h2>
      <div style={{ 
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 71, 160, 0.1)'
      }}>
        <p style={{ 
          fontSize: '1.2rem', 
          lineHeight: 1.9, 
          color: '#333', 
          marginBottom: '25px',
          textAlign: 'justify'
        }}>
          The <strong>World Association for Hallyu Studies (WAHS)</strong> invites submissions for its {new Date().getFullYear()} World Congress, 
          which seeks to develop a <strong>universal theory of pop culture success</strong> in the digital platform era. 
          The Korean Wave presents the paradigmatic case for this theoretical project: the first postcolonial 
          pop culture to achieve sustained global dominance in the platform capitalism age.
        </p>
        <p style={{ 
          fontSize: '1.2rem', 
          lineHeight: 1.9, 
          color: '#333', 
          marginBottom: '25px',
          textAlign: 'justify'
        }}>
          This congress proposes <strong style={{ color: '#CD2E3A' }}>CULTURAL DYNAMISM</strong> as a framework operating at the intersection of:
        </p>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginTop: '40px'
        }}>
          {[
            { title: 'Institutional Mechanisms', desc: 'Platform capitalism, production systems, business models' },
            { title: 'Cultural Dynamics', desc: 'Affective engagement, fandom practices, participatory culture' },
            { title: 'Geopolitical Contexts', desc: 'Postcolonial positioning, soft power, regional reception' },
            { title: 'Transmedia Storytelling', desc: 'IP management, cross-platform narratives, digital circulation' },
            { title: 'Gender Politics', desc: 'Female universalism, representation, identity formation' },
            { title: 'Methodological Innovation', desc: 'Digital humanities, computational analysis, mixed methods' }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, rgba(0, 71, 160, 0.05) 0%, rgba(205, 46, 58, 0.05) 100%)',
              padding: '25px',
              borderRadius: '15px',
              border: '1px solid rgba(0, 71, 160, 0.1)',
              transition: 'transform 0.3s'
            }} className="hover:transform hover:scale-[1.02]">
              <h3 style={{ 
                fontSize: '1.3rem', 
                color: '#0047A0', 
                marginBottom: '10px',
                fontWeight: '600'
              }}>
                {item.title}
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                color: '#555', 
                lineHeight: 1.6
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const SimpleSpeakers = () => (
  <section style={{ 
    padding: '100px 24px',
    background: 'linear-gradient(135deg, #0a1f3d 0%, #1a1a2e 100%)',
    color: 'white'
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: '700',
        background: 'linear-gradient(90deg, #fff 0%, #a0c8ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        FEATURED SPEAKERS
      </h2>
      <p style={{ 
        fontSize: '1.2rem', 
        textAlign: 'center',
        marginBottom: '60px',
        opacity: 0.8,
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        World-renowned scholars and industry leaders shaping the future of Hallyu studies
      </p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {[
          { name: 'Dr. Kim Jiyoung', title: 'Director, Korean Culture Institute', affiliation: 'Seoul National University', focus: 'Cultural Policy & Soft Power' },
          { name: 'Prof. Lee Minho', title: 'Chair of Media Studies', affiliation: 'Yonsei University', focus: 'Digital Platforms & Circulation' },
          { name: 'Dr. Park Sooyoung', title: 'Research Fellow', affiliation: 'Harvard Korea Institute', focus: 'Transnational Fandom' },
          { name: 'Prof. Choi Young', title: 'Department Head', affiliation: 'University of Tokyo', focus: 'Regional Reception Studies' }
        ].map((speaker, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s',
            backdropFilter: 'blur(10px)'
          }} className="hover:bg-white/10">
            <div style={{ 
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {speaker.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 style={{ 
              fontSize: '1.4rem', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              {speaker.name}
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              marginBottom: '5px',
              opacity: 0.9,
              color: '#a0c8ff'
            }}>
              {speaker.title}
            </p>
            <p style={{ 
              fontSize: '0.9rem', 
              marginBottom: '15px',
              opacity: 0.7
            }}>
              {speaker.affiliation}
            </p>
            <div style={{
              padding: '8px 15px',
              background: 'rgba(0, 71, 160, 0.2)',
              borderRadius: '20px',
              fontSize: '0.85rem',
              display: 'inline-block',
              border: '1px solid rgba(0, 71, 160, 0.3)'
            }}>
              {speaker.focus}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SimpleTracks = ({ year }: { year: string }) => (
  <section style={{ 
    padding: '100px 24px',
    background: 'white'
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        color: '#0047A0', 
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: '700'
      }}>
        RESEARCH TRACKS
      </h2>
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#555', 
        textAlign: 'center',
        marginBottom: '60px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        Submit your abstract to one of two thematic tracks for Congress {year}
      </p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '40px',
        marginBottom: '60px'
      }}>
        {/* Track 1 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 71, 160, 0.05) 0%, rgba(0, 71, 160, 0.1) 100%)',
          borderRadius: '20px',
          padding: '40px',
          border: '2px solid rgba(0, 71, 160, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#0047A0',
            color: 'white',
            padding: '10px 20px',
            borderBottomLeftRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            ANNUAL THEME
          </div>
          <h3 style={{ 
            fontSize: '1.8rem', 
            color: '#0047A0', 
            marginBottom: '20px',
            fontWeight: '700'
          }}>
            Track 1: Cultural Dynamism
          </h3>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.8, 
            color: '#333', 
            marginBottom: '25px'
          }}>
            Papers addressing theoretical, empirical, or methodological aspects of cultural dynamism in the digital platform era.
          </p>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            {[
              'Platform capitalism & digital circulation',
              'Gender politics & female universalism', 
              'Production systems & business models',
              'Fandom practices & participatory culture',
              'Postcolonial positioning',
              'Transmedia storytelling',
              'Comparative cases beyond Korea',
              'Methodological innovations'
            ].map((topic, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.95rem',
                color: '#444'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#0047A0',
                  borderRadius: '50%',
                  marginRight: '10px'
                }}></div>
                {topic}
              </div>
            ))}
          </div>
        </div>
        
        {/* Track 2 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(205, 46, 58, 0.05) 0%, rgba(205, 46, 58, 0.1) 100%)',
          borderRadius: '20px',
          padding: '40px',
          border: '2px solid rgba(205, 46, 58, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#CD2E3A',
            color: 'white',
            padding: '10px 20px',
            borderBottomLeftRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            OPEN TOPICS
          </div>
          <h3 style={{ 
            fontSize: '1.8rem', 
            color: '#CD2E3A', 
            marginBottom: '20px',
            fontWeight: '700'
          }}>
            Track 2: Open Topics in Hallyu Studies
          </h3>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.8, 
            color: '#333', 
            marginBottom: '25px'
          }}>
            All topics related to Korean Wave studies are welcome in this inclusive track.
          </p>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            {[
              '