"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { portfolio } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Starfield } from "./Starfield";
import { KineticCursor } from "./KineticCursor";

const navigation = [["about", "About"], ["work", "Work"], ["experience", "Experience"], ["education", "Education"]] as const;

function Arrow() { return <span aria-hidden="true">↗</span>; }

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 7.8H1.8V22h3.4V7.8ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM22 13.8c0-4.3-2.3-6.3-5.3-6.3-2.4 0-3.5 1.3-4.1 2.2V7.8H9.2V22h3.4v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H22v-8.2Z" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.7A10.3 10.3 0 0 0 8.7 21.8c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3 .9.1-.7.4-1.2.7-1.5-2.3-.3-4.7-1.2-4.7-5.1 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.8 1.1a9.8 9.8 0 0 1 5.1 0c2-1.3 2.8-1.1 2.8-1.1.6 1.5.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.4 4.8-4.7 5.1.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.3 10.3 0 0 0 12 1.7Z" /></svg>;
}

function ProjectVisual({ type }: { type: string }) {
  if (type === "robot") return <div className="project-visual robot" aria-hidden="true"><div className="grid" /><div className="robot-body"><i /><i /><i /><i /><b /></div><span>Locomotion policy simulation</span></div>;
  if (type === "analytics") return <div className="project-visual analytics" aria-hidden="true"><div className="grid" /><div className="bars">{[45, 66, 52, 82, 63, 91, 74, 86].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><span>Eight data sources · Four ML models</span></div>;
  if (type === "signal") return <div className="project-visual signal" aria-hidden="true"><div className="grid" /><div className="wave">{Array.from({ length: 13 }, (_, index) => <i key={index} />)}</div><span>Live anomaly detection</span></div>;
  if (type === "pareto") return <div className="project-visual pareto" aria-hidden="true"><div className="grid" /><div className="points">{[[12, 77], [23, 67], [35, 57], [49, 47], [62, 37], [75, 29], [88, 22]].map(([x, y], index) => <i key={index} style={{ left: `${x}%`, top: `${y}%` }} />)}</div><span>Multi-objective Pareto front</span></div>;
  return <div className="project-visual map" aria-hidden="true"><div className="grid" /><div className="radar"><i /><i /><i /><b /></div><span>Five live signals · One view</span></div>;
}

export function PortfolioPage() {
  const p = portfolio;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <main id="top">
      <Starfield />
      <KineticCursor />

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Jay Chawla, home"><span>JC</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav>
        <div className="header-actions">
          <a className="social-button" href={p.person.linkedin} target="_blank" rel="noreferrer" aria-label="Jay Chawla on LinkedIn"><LinkedInIcon /></a>
          <a className="social-button" href={p.person.github} target="_blank" rel="noreferrer" aria-label="Jay Chawla on GitHub"><GitHubIcon /></a>
          <a className="resume-link" href={p.person.resumePath} target="_blank" rel="noreferrer">Résumé <Arrow /></a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? "Close" : "Menu"}</button>
        {menuOpen && <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">{navigation.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}<a href={p.person.linkedin} target="_blank" rel="noreferrer">LinkedIn<Arrow /></a><a href={p.person.github} target="_blank" rel="noreferrer">GitHub<Arrow /></a><a href={p.person.resumePath} target="_blank" rel="noreferrer">Résumé<Arrow /></a></nav>}
      </header>

      <section className="hero shell">
        <p className="hero-role">AI/ML and software engineer in Singapore</p>
        <div className="hero-stage">
          <h1 aria-label="Jay Chawla"><span>JAY</span><em>CHAWLA</em></h1>
          <figure className="portrait-frame">
            <div className="portrait-frame__media">
              <Image
                className="portrait-photo"
                src="/jay-chawla-portrait.png"
                alt="Jay Chawla in front of the New York City skyline"
                fill
                priority
                sizes="(max-width: 600px) 62vw, (max-width: 900px) 190px, 300px"
              />
            </div>
            <i className="portrait-frame__spark" aria-hidden="true" />
          </figure>
        </div>
        <div className="hero-bottom">
          <div>
            <h2>I turn complex data into systems people can actually use.</h2>
            <p>{p.person.intro}</p>
          </div>
          <div className="hero-actions"><a href="#work">View my work <Arrow /></a><a href={`mailto:${p.person.email}`}>Get in touch</a></div>
          <aside><strong>Currently</strong><span>MSc Computer Engineering at NUS</span><small>Open to meaningful engineering work</small></aside>
        </div>
      </section>

      <section id="about" className="about-section shell">
        <Reveal><header className="section-header"><p>About</p><h2>Engineering breadth, backed by fundamentals.</h2></header></Reveal>
        <div className="about-intro"><p>I work across machine learning, simulation, connected hardware, and full-stack software. The common thread is straightforward: understand the problem deeply, then build the clearest useful solution.</p></div>
        <div className="skills-grid">{p.skillGroups.map((group) => <Reveal key={group.title}><article><h3>{group.title}</h3><ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></article></Reveal>)}</div>
      </section>

      <section id="work" className="work-section shell">
        <Reveal><header className="section-header"><p>Selected work</p><h2>Projects built around real problems.</h2></header></Reveal>
        <div className="project-list">{p.projects.map((project, index) => <Reveal key={project.title}><article className="project">
          <div className="project-copy">
            <p className="project-meta">{project.meta.replace(" · ", "  •  ")}</p>
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </div>
          <ProjectVisual type={project.visual} />
          <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
        </article></Reveal>)}</div>
      </section>

      <section id="experience" className="experience-section">
        <div className="shell">
          <Reveal><header className="section-header"><p>Experience</p><h2>Work that shipped, taught, or discovered something.</h2></header></Reveal>
          <div className="experience-list">{p.experience.map((job) => <Reveal key={`${job.company}-${job.role}`}><article className="experience">
            <div className="experience-heading"><p>{job.period}</p><h3>{job.role}</h3><h4>{job.company} · {job.location}</h4></div>
            <div className="experience-content"><p>{job.summary}</p>{job.bullets.length > 0 && <ul>{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</div>
          </article></Reveal>)}</div>
        </div>
      </section>

      <section id="education" className="education-section shell">
        <Reveal><header className="section-header"><p>Education</p><h2>Where I built the foundation.</h2></header></Reveal>
        <div className="education-block">{p.education.map((education) => <Reveal key={education.school}><article>
          <div className="education-logo">
            <Image src={education.logo} alt={education.logoAlt} width={320} height={120} sizes="(max-width: 600px) 150px, 210px" />
          </div>
          <div><p>{education.period}</p><h3>{education.degree}</h3><h4>{education.school} · {education.location}</h4>{education.note && <span>{education.note}</span>}</div>
        </article></Reveal>)}</div>
      </section>

      <section id="contact" className="contact-section shell">
        <Reveal><p>Have an interesting problem?</p><h2>Let&apos;s talk.</h2><a href={`mailto:${p.person.email}`}>{p.person.email}<Arrow /></a></Reveal>
        <div><a href={p.person.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href={p.person.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href={p.person.resumePath} target="_blank" rel="noreferrer">Résumé <Arrow /></a></div>
      </section>

      <footer className="site-footer shell"><span>© {new Date().getFullYear()} Jay Chawla</span><span>Designed and built in Singapore</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
