'use client';

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const TYPED_FULL = 'software & audio engineer based in nyc';

  useEffect(() => {
    // Start typing after hero name finishes animating (delay 0.15 + duration 1.0 = ~1.15s)
    let i = 0;
    let tick: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      tick = setInterval(() => {
        i++;
        setTypedText(TYPED_FULL.slice(0, i));
        if (i >= TYPED_FULL.length) {
          clearInterval(tick);
          setTypingDone(true);
        }
      }, 40);
    }, 1300);
    return () => { clearTimeout(start); clearInterval(tick); };
  }, []);

  const experience = [
    {
      company: "South Street Securities",
      subtitle: "Matrix Applications",
      role: "Senior System Engineer",
      period: "May 2023 – Present",
      location: "New York, NY",
      highlights: [
        "Engineered FIX to XML converters handling 2,500+ daily transactions ($100M+) with 99.9% uptime",
        "Built full-stack trade delivery system with React.js, Flask, and AWS Lambda deployment",
        "Leveraged AI to accelerate development across Java, JavaScript, and Python systems",
        "Improved developer experience by provisioning Vagrant/Ansible environments, reducing onboarding by 50%",
      ]
    },
    {
      company: "Retail Velocity",
      role: "Implementation Engineer",
      period: "Jan 2022 – Feb 2023",
      location: "Remote",
      highlights: [
        "Transitioned REST APIs to .NET MVC, enhancing performance and scalability",
        "Developed ML models using Azure ML Studio to forecast sales and inventory",
        "Optimized PowerShell scripts and SQL queries for data accuracy",
      ]
    },
    {
      company: "Alstom / Bombardier",
      role: "Software Engineer Co-Op",
      period: "May 2019 – Dec 2020",
      location: "Pittsburgh, PA",
      highlights: [
        "Developed train propulsion software in C-based embedded environment",
      ]
    }
  ];

  const projects = [
    {
      title: "Nets Front Office Tool",
      description: "Cap & roster intelligence tool for the Brooklyn Nets. Live scenario modeling — release players, sign free agents, and watch the salary cap adjust in real time. Built as a senior full-stack engineering exercise.",
      tech: ["React", "TypeScript", "Node.js", "SQLite", "Python", "nba_api"],
      link: "/projects/nets",
      internal: true,
    },
    {
      title: "Electronic Press Kit",
      description: "EPK and mastering service page. for for DJs, producers, & labels.",
      tech: ["GSAP", "Next.js"],
      link: "/projects/audio-services",
      internal: true,
    },
    {
      title: "\"Not a Financial Advisor\" Agent",
      description: "AI agent that can help you understand financial decisions and the market. Built with Langchain and gets news from Alpha Vantage API",
      tech: ["LangChain", "GPT-4", "Alpha Vantage API", "Next.js"],
      link: "/projects/finance-agent",
      internal: true,
    },
    {
      title: "Portfolio",
      description: "This site. Dockerized, optimized for Kubernetes, deployed through Vercel. Animated with GSAP. Designed to get out of the way.",
      tech: ["Next.js", "GSAP", "Docker", "Vercel"],
      link: "https://github.com/ramonkaushik/ramonbot",
      internal: false,
    },
  ];

  const skills = [
    "Java", "Python", "JavaScript", "C++", "SQL", "Go",
    "Spring Boot", "React", "Next.js", "Flask", ".NET",
    "Docker", "Jenkins", "Ansible", "AWS", "Azure ML",
    "MongoDB", "PostgreSQL", "Copilot", "Claude"
  ];

  useEffect(() => {
    gsap.config({ force3D: true, nullTargetWarn: false });

    const ctx = gsap.context(() => {
      // Header — simple fade, no movement
      gsap.fromTo(".fade-in",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.9, ease: "power2.out", stagger: 0.05,
          onComplete() { gsap.set(".fade-in", { clearProps: "will-change" }); }
        }
      );

      // Hero name — translate only transform+opacity, no scale
      gsap.fromTo(".hero-text",
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.0, ease: "expo.out", delay: 0.15,
          onComplete() { gsap.set(".hero-text", { clearProps: "transform,will-change" }); }
        }
      );

      // Scroll sections — absolute y, not yPercent (more predictable)
      const sections = [aboutRef, experienceRef, skillsRef, contactRef];
      sections.forEach((ref) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out",
            onComplete() { gsap.set(ref.current, { clearProps: "transform,will-change" }); },
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          }
        );
      });

      // Experience items — slide from left
      gsap.fromTo(".exp-item",
        { autoAlpha: 0, x: -12 },
        {
          autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
          onComplete() { gsap.set(".exp-item", { clearProps: "transform,will-change" }); },
          scrollTrigger: { trigger: experienceRef.current, start: "top 83%", once: true },
        }
      );

      // Project cards — rise up
      gsap.fromTo(".project-card",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07,
          onComplete() { gsap.set(".project-card", { clearProps: "transform,will-change" }); },
          scrollTrigger: { trigger: projectsRef.current, start: "top 83%", once: true },
        }
      );

      // Skills — pure fade only, no scale (scale blurs small text)
      gsap.fromTo(".skill-tag",
        { autoAlpha: 0 },
        {
          autoAlpha: 1, duration: 0.35, ease: "power2.out", stagger: 0.018,
          scrollTrigger: { trigger: skillsRef.current, start: "top 83%", once: true },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const ProjectCard = ({ project, idx }: { project: typeof projects[0]; idx: number }) => {
    const inner = (
      <div className="project-card group flex gap-6 py-7 border-t border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors duration-300 cursor-pointer">
        <span className="text-[11px] text-[#2e2e2e] font-mono mt-[3px] shrink-0 w-5 select-none">
          {String(idx + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-base text-[#ccc] group-hover:text-[#eee] transition-colors duration-200">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#2a2a2a] group-hover:text-[#555] transition-colors duration-200 shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-[#555] leading-relaxed mb-4 group-hover:text-[#666] transition-colors duration-200">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((t) => (
              <span key={t} className="text-[10px] tracking-widest text-[#333] uppercase group-hover:text-[#444] transition-colors duration-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );

    if (project.internal) {
      return <Link href={project.link}>{inner}</Link>;
    }
    return <a href={project.link} target="_blank" rel="noopener noreferrer">{inner}</a>;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-[#eee] selection:bg-[#eee] selection:text-[#0a0a0a]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
        
        :root {
          --black: #0a0a0a;
          --white: #eee;
          --gray-light: #bbb;
          --gray: #999;
          --gray-mid: #777;
          --gray-dark: #555;
          --border: #333;
          --border-light: #444;
        }

        /* GPU compositing baseline — no will-change on idle elements */
        .fade-in,
        .hero-text,
        .exp-item,
        .project-card,
        .skill-tag {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        body {
          background: var(--black);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.01em;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .serif {
          font-family: 'Instrument Serif', serif;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--black);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--border-light);
        }

        .noise {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          z-index: 1000;
        }

        /* Removed scanlines for cleaner readability */

        /* Typing cursor */
        .type-cursor {
          display: inline-block;
          color: #555;
          margin-left: 1px;
          animation: cursor-blink 0.9s step-end infinite;
        }
        .type-cursor.done {
          animation: cursor-fade 0.6s ease-out 1s forwards;
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes cursor-fade {
          to { opacity: 0; }
        }

        /* Focus states for accessibility */
        a:focus-visible, button:focus-visible {
          outline: 2px solid #888;
          outline-offset: 2px;
        }
      `}</style>

      <div className="noise" />

      {/* Audio element */}
      

      {/* Header */}
      <header className="fade-in fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center mix-blend-difference">
        <span className="text-sm tracking-wide font-medium">RK</span>
        <nav className="flex items-center gap-8">
          {["about", "work", "projects", "contact"].map((item) => (
            <a 
              key={item} 
              href={`#${item}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm tracking-wide text-[#999] hover:text-[#eee] transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-end px-6 pb-24 pt-32">
        <div className="max-w-5xl">
          <p className="text-sm text-[#999] mb-6 tracking-wide">
            {typedText}<span className={`type-cursor${typingDone ? ' done' : ''}`}>|</span>
          </p>
          <h1 className="hero-text serif text-[clamp(3rem,12vw,9rem)] leading-[0.9] tracking-tight font-normal text-[#fff]">
            Ramon<br />
            <span className="italic">Kaushik</span>
          </h1>
          <div className="hero-text mt-12 flex gap-8 text-sm text-[#999]">
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 hover:text-[#eee] transition-colors"
            >
              software <ArrowUpRight className="w-4 h-4" />
            </button>
            <Link href="/projects/audio-services" className="flex items-center gap-2 hover:text-[#eee] transition-colors">
              music <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" ref={aboutRef} className="px-6 py-32 border-t border-[#222]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-sm text-[#888] tracking-wide">Info</span>
          </div>
          <div className="md:col-span-9">
            <p className="text-xl leading-relaxed text-[#ccc] max-w-2xl">
              Backend systems, cloud infrastructure, AI tooling. 
              Building things that work and stay working. 
              4+ years shipping production code.
            </p>
            <p className="text-xl leading-relaxed text-[#ccc] max-w-2xl mt-6">
              Previously embedded systems, now fintech. 
              University of Pittsburgh, Computer Engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="work" ref={experienceRef} className="px-6 py-32 border-t border-[#222]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-sm text-[#888] tracking-wide">Experience</span>
          </div>
          <div className="md:col-span-9 space-y-20">
            {experience.map((job, idx) => (
              <div key={idx} className="exp-item">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-1">
                  <h3 className="text-lg font-medium text-[#eee]">
                    {job.company}
                    {job.subtitle && <span className="text-[#888] font-normal"> / {job.subtitle}</span>}
                  </h3>
                  <span className="text-sm text-[#888]">{job.period}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-6">
                  <p className="text-base text-[#aaa]">{job.role}</p>
                  <span className="text-sm text-[#777]">{job.location}</span>
                </div>
                <ul className="space-y-3">
                  {job.highlights.map((highlight, i) => (
                    <li key={i} className="text-base text-[#999] leading-relaxed pl-4 border-l-2 border-[#333]">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" ref={projectsRef} className="px-6 py-32 border-t border-[#222]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-sm text-[#888] tracking-wide">Projects</span>
          </div>
          <div className="md:col-span-9">
            {projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section ref={skillsRef} className="px-6 py-32 border-t border-[#222]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-sm text-[#888] tracking-wide">Skills</span>
          </div>
          <div className="md:col-span-9">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {skills.map((skill) => (
                <span key={skill} className="skill-tag text-base text-[#999]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="px-6 py-32 border-t border-[#222]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-sm text-[#888] tracking-wide">Certifications</span>
          </div>
          <div className="md:col-span-9 space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <span className="text-base text-[#bbb]">Azure AI Engineer Associate</span>
              <span className="text-sm text-[#888]">AI-102 · July 2022</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <span className="text-base text-[#bbb]">Azure Fundamentals</span>
              <span className="text-sm text-[#888]">AZ-900 · June 2022</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" ref={contactRef} className="px-6 py-32 border-t border-[#222]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-sm text-[#888] tracking-wide">Contact</span>
          </div>
          <div className="md:col-span-9">
            <a 
              href="mailto:kaushikramon@gmail.com" 
              className="serif text-3xl md:text-4xl italic text-[#eee] hover:text-[#999] transition-colors"
            >
              kaushikramon@gmail.com
            </a>
            <div className="mt-8 flex gap-6 text-sm text-[#999]">
              <a href="https://github.com/ramonkaushik" target="_blank" className="flex items-center gap-2 hover:text-[#eee] transition-colors">
                GitHub <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/in/ramonkau" target="_blank" className="flex items-center gap-2 hover:text-[#eee] transition-colors">
                LinkedIn <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#222]">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-[#666]">
          <span>Ten Toes Down © 2026</span>
          <span>NYC</span>
        </div>
      </footer>

    </div>
  );
}