"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { portfolio } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Starfield } from "./Starfield";
import { KineticCursor } from "./KineticCursor";
import { PortraitField } from "./PortraitField";

const navigation = [["about", "About"], ["work", "Work"], ["experience", "Experience"], ["education", "Education"]] as const;

function Arrow() { return <span aria-hidden="true">↗</span>; }

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 7.8H1.8V22h3.4V7.8ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM22 13.8c0-4.3-2.3-6.3-5.3-6.3-2.4 0-3.5 1.3-4.1 2.2V7.8H9.2V22h3.4v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H22v-8.2Z" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.7A10.3 10.3 0 0 0 8.7 21.8c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3 .9.1-.7.4-1.2.7-1.5-2.3-.3-4.7-1.2-4.7-5.1 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.8 1.1a9.8 9.8 0 0 1 5.1 0c2-1.3 2.8-1.1 2.8-1.1.6 1.5.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.4 4.8-4.7 5.1.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.3 10.3 0 0 0 12 1.7Z" /></svg>;
}

function ProjectVisual({ type }: { type: string }) {
  if (type === "robot") return <div className="project-visual robot robot-video">
    <video autoPlay loop muted playsInline preload="metadata" poster="/isaaclab-go2-rough-poster.png" aria-label="Isaac Lab Unitree Go2 traversing rough terrain">
      <source src="/isaaclab-go2-rough.mp4" type="video/mp4" />
    </video>
    <div className="grid" aria-hidden="true" />
    <div className="robot-video__hud" aria-hidden="true"><b>UNITREE GO2</b><i>ROUGH TERRAIN</i><em>SIM / 01</em></div>
    <span>Isaac Lab · single-agent terrain rollout</span>
  </div>;
  if (type === "analytics") return <div className="project-visual analytics procurement-visual" role="img" aria-label="Animated procurement intelligence dashboard showing spend, variance, anomalies, and model confidence">
    <div className="grid" aria-hidden="true" />
    <div className="procurement-topbar" aria-hidden="true"><b>Procurement intelligence</b><span><i /> 8 sources live</span></div>
    <div className="procurement-kpis" aria-hidden="true">
      <div><small>Spend coverage</small><strong>92.4%</strong><em>+4.8%</em></div>
      <div><small>Price variance</small><strong>3.18%</strong><em>↓ 0.7%</em></div>
      <div><small>Anomalies</small><strong>14</strong><em>Needs review</em></div>
    </div>
    <div className="procurement-chart" aria-hidden="true">
      <div className="procurement-axis"><span>120</span><span>80</span><span>40</span><span>0</span></div>
      <div className="procurement-bars">{[48, 67, 55, 79, 64, 88, 72, 84].map((height, index) => <i key={index} style={{ "--bar-height": `${height}%` } as CSSProperties} />)}</div>
      <svg className="procurement-line" viewBox="0 0 700 150" preserveAspectRatio="none">
        <path className="procurement-line__glow" d="M12 126 C82 112 102 74 186 88 S292 120 372 62 S486 78 548 40 S632 48 688 18" />
        <path className="procurement-line__stroke" d="M12 126 C82 112 102 74 186 88 S292 120 372 62 S486 78 548 40 S632 48 688 18" />
        {[126, 88, 62, 40, 18].map((y, index) => <circle key={index} cx={[12, 186, 372, 548, 688][index]} cy={y} r="4" />)}
      </svg>
      <div className="procurement-scan" />
    </div>
    <div className="procurement-feed" aria-hidden="true"><span><i /> Flagged: Plant 04 / unit-price deviation</span><strong>94% confidence</strong></div>
    <span>From eight SAP sources to four predictive models</span>
  </div>;
  if (type === "signal") return <div className="project-visual signal iot-visual" role="img" aria-label="Animated IoT monitoring pipeline detecting and classifying a sensor failure">
    <div className="grid" aria-hidden="true" />
    <div className="iot-header" aria-hidden="true"><b>Field monitor</b><span><i /> 24 devices online</span></div>
    <div className="iot-pipeline" aria-hidden="true">
      <div className="iot-node"><span>01</span><b>ESP32</b><small>Sensor edge</small></div>
      <div className="iot-link"><i /><i /><i /></div>
      <div className="iot-node"><span>02</span><b>MQTT</b><small>Message broker</small></div>
      <div className="iot-link"><i /><i /><i /></div>
      <div className="iot-node iot-node--alert"><span>03</span><b>MATLAB</b><small>State classifier</small></div>
    </div>
    <div className="iot-telemetry" aria-hidden="true">
      <div className="iot-telemetry__label"><span>Motor current</span><b>2.84 A</b></div>
      <svg viewBox="0 0 720 90" preserveAspectRatio="none">
        <path className="iot-wave iot-wave--glow" d="M0 54 L35 51 L70 55 L105 48 L140 53 L175 49 L210 55 L245 50 L280 53 L315 48 L350 54 L385 51 L420 18 L438 78 L456 28 L478 65 L500 46 L535 52 L570 49 L605 54 L640 50 L680 53 L720 49" />
        <path className="iot-wave" d="M0 54 L35 51 L70 55 L105 48 L140 53 L175 49 L210 55 L245 50 L280 53 L315 48 L350 54 L385 51 L420 18 L438 78 L456 28 L478 65 L500 46 L535 52 L570 49 L605 54 L640 50 L680 53 L720 49" />
      </svg>
      <div className="iot-event"><i /> Failure signature <strong>detected</strong><small>1.7s ago</small></div>
    </div>
    <span>Edge signal → failure classified in 180 ms</span>
  </div>;
  if (type === "pareto") return <div className="project-visual pareto pareto-visual" role="img" aria-label="Animated multi-objective optimization search showing candidate designs and the Pareto frontier">
    <div className="pareto-header" aria-hidden="true"><b>Design search</b><span>Generation 48 / 60</span></div>
    <div className="pareto-summary" aria-hidden="true"><span><small>Population</small><b>128</b></span><span><small>Non-dominated</small><b>11</b></span><span><small>Hypervolume</small><b>0.847</b></span></div>
    <div className="pareto-plot" aria-hidden="true">
      <span className="pareto-y">Lower cost</span><span className="pareto-x">Higher performance</span>
      <svg viewBox="0 0 700 220" preserveAspectRatio="none">
        <g className="pareto-cloud">{[[65,190],[110,174],[145,185],[182,151],[212,172],[242,135],[276,156],[306,117],[338,139],[370,95],[405,119],[438,78],[470,101],[506,62],[542,82],[576,45],[608,67],[642,31],[675,49]].map(([x,y],index)=><circle key={index} cx={x} cy={y} r="4" />)}</g>
        <path className="pareto-frontier pareto-frontier--glow" d="M66 176 C132 172 166 148 215 142 S286 118 330 111 S398 88 443 81 S514 57 556 50 S618 29 672 24" />
        <path className="pareto-frontier" d="M66 176 C132 172 166 148 215 142 S286 118 330 111 S398 88 443 81 S514 57 556 50 S618 29 672 24" />
        <circle className="pareto-choice" cx="443" cy="81" r="8" />
      </svg>
      <div className="pareto-callout"><i /> Selected compromise<strong>Design 074</strong></div>
    </div>
    <div className="pareto-legend" aria-hidden="true"><span><i /> Candidate designs</span><span><i /> Pareto frontier</span></div>
    <span>Cost and performance, balanced—not averaged</span>
  </div>;
  return <div className="project-visual map discovery-visual" role="img" aria-label="Animated local discovery app ranking nearby places using weather, crowd, cost, and distance signals">
    <div className="discovery-header" aria-hidden="true"><b>What fits tonight?</b><span>Singapore · 7:42 PM</span></div>
    <div className="discovery-search" aria-hidden="true"><i>⌕</i><span>Dinner under $25, somewhere quiet</span><b>↵</b></div>
    <div className="discovery-signals" aria-hidden="true"><span>Clear · 27°</span><span>Low crowd</span><span>Open now</span><span>≤ 12 min</span></div>
    <div className="discovery-results" aria-hidden="true">
      <article className="discovery-result discovery-result--best"><em>01</em><div><b>Little Fern</b><small>Tiong Bahru · Modern Asian</small></div><span><strong>94</strong><small>match</small></span></article>
      <article className="discovery-result"><em>02</em><div><b>Moonstone</b><small>Amoy Street · Café</small></div><span><strong>88</strong><small>match</small></span></article>
      <article className="discovery-result"><em>03</em><div><b>Afterglow</b><small>Keong Saik · Plant-based</small></div><span><strong>84</strong><small>match</small></span></article>
    </div>
    <div className="discovery-reason" aria-hidden="true"><i /> Best fit: quiet now, 9-minute walk, within budget</div>
    <span>Five live signals, ranked into one useful answer</span>
  </div>;
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
            <PortraitField />
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
          </figure>
        </div>
        <div className="hero-bottom">
          <div>
            <h2>I turn complex data into systems people can actually use.</h2>
            <p>{p.person.intro}</p>
          </div>
          <aside><strong>Currently</strong><span>MSc Computer Engineering at NUS</span><small>Open to meaningful engineering work</small></aside>
        </div>
      </section>

      <section id="about" className="about-section shell">
        <Reveal><header className="section-header"><p>About</p><h2>Engineering breadth, backed by fundamentals.</h2></header></Reveal>
        <div className="about-intro"><p>I work across machine learning, simulation, connected hardware, and full-stack software. The common thread is straightforward: understand the problem deeply, then build the clearest useful solution.</p></div>
        <div className="capability-list">{p.skillGroups.map((group, index) => <Reveal key={group.title}><article className="capability">
          <div className="capability-heading"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{group.title}</h3><p>{group.description}</p></div></div>
          <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </article></Reveal>)}</div>
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
            <div className="experience-brand"><Image src={job.logo} alt={job.logoAlt} width={264} height={80} sizes="(max-width: 600px) 140px, 160px" /></div>
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
