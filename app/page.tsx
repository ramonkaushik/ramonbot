'use client';

// Import React hooks for managing component state and DOM references
import { useEffect, useRef } from "react";
// Import UI components from shadcn/ui library
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Import icons from lucide-react icon library
import { Mail, Github, Linkedin, Award, Briefcase, Code2 } from "lucide-react";
// Import GSAP animation library and ScrollTrigger plugin
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin with GSAP to enable scroll-based animations
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // Create refs to target specific DOM elements for animations
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const certsRef = useRef(null);
  const interestsRef = useRef(null);
  const contactRef = useRef(null);
  const heroRef = useRef(null);
  const headerRef = useRef(null);
  const projectsRef = useRef(null);

  // Array of work experience data with company, role, and key achievements
  const experience = [
    {
      company: "South Street Securities - Matrix Applications",
      role: "Senior System Engineer",
      period: "May 2023 – Current",
      location: "New York, NY",
      highlights: [
        "Leveraged GitHub Copilot, Llama, and ChatGPT daily to accelerate development across Java, JavaScript, and Python",
        "Improved developer experience by provisioning Vagrant/Ansible environments, reducing onboarding by 50%",
        "Engineered FIX to XML converters handling 2,500+ daily transactions ($100M+) with 99.9% uptime",
        "Built full-stack trade delivery system with React.js, Flask, and AWS Lambda deployment",
      ]
    },
    {
      company: "Retail Velocity",
      role: "Implementation Engineer",
      period: "January 2022 – February 2023",
      location: "Remote",
      highlights: [
        "Transitioned REST APIs to .NET MVC, enhancing performance and scalability",
        "Developed ML models using Azure ML Studio to forecast sales and inventory",
        "Optimized PowerShell scripts and SQL queries for data accuracy",
      ]
    },
    {
      company: "Alstom/Bombardier",
      role: "Software Engineer Co-Op",
      period: "May 2019 – December 2020",
      location: "Pittsburgh, PA",
      highlights: [
        "Developed train propulsion software in C-based environment",
      ]
    }
  ];

  // Object organizing technical skills by category
  const skills = {
    "Languages": ["Java", "Python", "JavaScript", "C++", "SQL"],
    "Frameworks": ["Spring Boot", "React", "Next.js", "Flask", ".NET"],
    "DevOps": ["Docker", "Artifactory", "Jenkins", "Ansible", "Vagrant"],
    "GenAI Tools": ["GitHub Copilot", "ChatGPT", "Llama"],
    "Cloud & Data": ["AWS Lambda", "Azure ML", "MongoDB", "PostgreSQL"],
  };

  // Array of project data
  const projects = [
    {
      title: "Portfolio Website",
      description: "My personal portfolio website showcasing my projects, skills, and experience. Dockerized and optimized for Kubernetes. Animated with GSAP. UI from Assistance from Claude.",
      technologies: ["Next.js", "Docker", "Kubernetes", "Claude", "GSAP"],
      link: "https://github.com/ramonkaushik/ramonbot",
    },
  ];

  // Array of professional certifications with details
  const certifications = [
    { name: "Azure AI Engineer Associate", code: "AI-102", date: "July 2022" },
    { name: "Azure Fundamentals", code: "AZ-900", date: "June 2022" }
  ];

  // useEffect hook runs animations after component mounts
  useEffect(() => {
    // Initial page load animations - sequenced for "wow" factor
    // Create a timeline to coordinate multiple animations
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    // Animate header sliding down from above
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 }, // Starting state: invisible, 20px above
      { opacity: 1, y: 0, duration: 0.6 } // Ending state: visible, normal position
    );

    // Animate hero badge with scale effect
    tl.fromTo(
      ".hero-badge",
      { opacity: 0, scale: 0.8 }, // Start small and invisible
      { opacity: 1, scale: 1, duration: 0.5 },
      "-=0.3" // Start 0.3s before previous animation ends
    );

    

    // Animate hero title sliding up
    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.2"
    );

    // Animate hero description text
    tl.fromTo(
      ".hero-description",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );

    // Animate hero buttons appearing
    tl.fromTo(
      ".hero-buttons",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.2"
    );

    // About section - triggers when scrolled into view
    gsap.fromTo(
      aboutRef.current,
      { opacity: 0, y: 30, scale: 0.98 }, // Start slightly below and smaller
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: aboutRef.current, // Element that triggers animation
          start: "top 80%", // Trigger when top of element reaches 80% of viewport
          once: true, // Animation runs only once
        },
      }
    );

    // Skills cards - staggered animation
    // ... existing skills animation logic ...

    // NEW: Projects cards - staggered animation
    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1, // Staggered delay for each card
        scrollTrigger: {
          trigger: projectsRef.current, // Use the new ref
          start: "top 75%",
          once: true,
        },
      }
    );

    // Experience cards - animate with stagger (delay between each)
    gsap.fromTo(
      ".experience-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12, // 0.12s delay between each card
        scrollTrigger: {
          trigger: experienceRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );

    // Skills cards - staggered animation
    gsap.fromTo(
      ".skill-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );

    // Certifications slide in from left
    gsap.fromTo(
      ".cert-card-left",
      { opacity: 0, x: -40 }, // Start off-screen to the left
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: certsRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );

    // Certifications slide in from right
    gsap.fromTo(
      ".cert-card-right",
      { opacity: 0, x: 40 }, // Start off-screen to the right
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: certsRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );

    // Interests section - simple fade in
    gsap.fromTo(
      interestsRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: interestsRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );

    // Contact section - fade up
    gsap.fromTo(
      contactRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );

    // Cleanup function - removes all ScrollTrigger animations when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header - sticky navigation bar */}
      <header ref={headerRef} className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo/Name with gradient text effect */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ramon Kaushik
          </h1>
          {/* Navigation links */}
          <div className="flex gap-6 items-center">
            <a href="#about" className="text-sm hover:text-primary transition-colors">About</a>
            <a href="#experience" className="text-sm hover:text-primary transition-colors">Experience</a>
            <a href="#projects" className="text-sm hover:text-primary transition-colors">Projects</a>
            <a href="#skills" className="text-sm hover:text-primary transition-colors">Skills</a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero section - main landing area */}
      <section ref={heroRef} className="flex flex-1 items-center justify-center px-6 py-24 md:py-32">
        <div className="max-w-3xl text-center space-y-6">
          {/* Badge showing current role */}
          <Badge variant="secondary" className="hero-badge px-4 py-1">
            <Code2 className="w-3 h-3 mr-2" />
            Senior System Engineer
          </Badge>
          {/* Main headline */}
          <h2 className="hero-title text-4xl md:text-6xl font-bold tracking-tight">
            Developer Experience Focused Full-Stack Engineer
          </h2>
          {/* Subtitle describing expertise */}
          <p className="hero-description text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Full-Stack Engineer specializing in backend development, developer tooling, and cloud-native systems. 
            Lover of Java, Python, and JavaScript. I love making developers more productive.
          </p>
          {/* CTA buttons */}
          <div className="hero-buttons flex gap-4 justify-center flex-wrap">
            <Button variant="outline" size="lg" className="gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </section>

      {/* About section - brief biography */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-1 w-full">
        <Card ref={aboutRef} className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              I am a Senior System Engineer at South Street Securities with 4+ years of experience building 
              cloud-native applications, developer tools, and GenAI-augmented workflows. I work daily with 
              GitHub Copilot, ChatGPT, and Llama to accelerate development across Java, Python, and JavaScript applications.
            </p>
            <p>
              My focus is on improving developer experience, whether it is provisioning local development 
              environments that reduce onboarding time by 50%, or building high-performance systems that 
              handle millions in transactions with 99.9% uptime.
            </p>
            <p className="font-semibold text-foreground">
              University of Pittsburgh • B.S. Computer Engineering
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Experience section - work history */}
      <section id="experience" ref={experienceRef} className="mx-auto max-w-6xl px-6 py-16 w-full">
        <h3 className="text-3xl font-bold mb-8">Experience</h3>
        <div className="space-y-6">
          {/* Map through experience array and create a card for each job */}
          {experience.map((job, idx) => (
            <Card key={idx} className="experience-card hover:shadow-lg transition-shadow">
              <CardHeader>
                {/* Job title and company on left, dates and location on right */}
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">{job.role}</CardTitle>
                    <CardDescription className="text-base">{job.company}</CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{job.period}</div>
                    <div>{job.location}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Bullet points of job highlights */}
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {job.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* NEW: Projects section - Independent work and personal hacks */}
      <section id="projects" ref={projectsRef} className="mx-auto max-w-6xl px-6 py-16 w-full">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Code2 className="w-8 h-8" />
          Selected Projects
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map through projects array and create a card for each project */}
          {projects.map((project, idx) => (
            <Card key={idx} className="project-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {/* Display technologies as badges */}
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="default">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {/* Link to GitHub repository */}
                <Button variant="outline" className="gap-2" asChild>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills section - technical proficiencies organized by category */}
      <section id="skills" ref={skillsRef} className="mx-auto max-w-6xl px-6 py-1 w-full">
        <h3 className="text-3xl font-bold mb-8">Skills & Technologies</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Map through skills object and create a card for each category */}
          {Object.entries(skills).map(([category, items]) => (
            <Card key={category} className="skill-card">
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Display skills as badges */}
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications section - professional credentials */}
      <section ref={certsRef} className="mx-auto max-w-6xl px-6 py-16 w-full">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Award className="w-8 h-8" />
          Certifications
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Map through certifications and create a card for each */}
          {certifications.map((cert, idx) => (
            <Card key={cert.code} className={`border-2 ${idx === 0 ? 'cert-card-left' : 'cert-card-right'}`}>
              <CardHeader>
                <CardTitle className="text-lg">{cert.name}</CardTitle>
                <CardDescription>Microsoft Certified • {cert.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Earned {cert.date}</p>
                {/* Show detailed description for AI-102 cert */}
                {cert.code === "AI-102" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Computer vision, NLP, knowledge mining, and conversational AI solutions
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Interests section - personal hobbies and interests */}
      <section ref={interestsRef} className="mx-auto max-w-6xl px-6 py-1 w-full">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Beyond Code</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display interests as badge tags */}
            <div className="flex flex-wrap gap-2">
              {["Chess", "Music Production", "DJing", "Coffee", "Basketball", "Fashion", 
                "Design", "Hiking", "Synthesizers", "Adobe Suite"].map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contact CTA section - encourage reaching out */}
      <section id="contact" className="mx-auto max-w-4xl px-6 py-20 w-full text-center">
        <Card ref={contactRef} className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">Let us Build Something Together</CardTitle>
            <CardDescription className="text-base">
              Interested in discussing developer experience, GenAI tools, or platform engineering?
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Contact buttons with email and phone */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="gap-2">
                <Mail className="w-4 h-4" />
                kaushikramon@gmail.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer - copyright and social links */}
      <footer className="border-t mt-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-8 flex justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Ramon Kaushik. All rights reserved.</p>
          {/* Social media and contact links */}
          <div className="flex gap-4">
            <a href="mailto:kaushikramon@gmail.com" className="hover:text-primary transition-colors">
              Email
            </a>
            <a href="https://www.github.com/ramonkaushik" className="hover:text-primary transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/ramonkau" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}