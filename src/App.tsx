import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import "./index.css";

/* =========================================
   DATA
========================================= */

const SERVICES = [
  {
    no: "01",
    title: "Website Development",
    text: "High-performance websites with strong visual direction, responsive engineering and purposeful motion.",
  },
  {
    no: "02",
    title: "UI / UX Design",
    text: "Clear interfaces and digital systems designed around people, brands and real business goals.",
  },
  {
    no: "03",
    title: "Web Applications",
    text: "Scalable web products that turn complex workflows into simple, useful experiences.",
  },
  {
    no: "04",
    title: "Mobile Applications",
    text: "Thoughtful mobile experiences built for clarity, speed and everyday usability.",
  },
  {
    no: "05",
    title: "Maintenance & Support",
    text: "Reliable updates, performance improvements, security and ongoing technical support.",
  },
  {
    no: "06",
    title: "SEO & Digital Growth",
    text: "Search-ready digital experiences supported by content, analytics and growth-focused improvements.",
  },
];

const PROJECTS = [
  {
    no: "01",
    title: "NOVA",
    type: "Web Experience",
    className: "project-dark",
  },
  {
    no: "02",
    title: "ARC / SPACES",
    type: "Digital Platform",
    className: "project-gold",
  },
  {
    no: "03",
    title: "MONO / LABS",
    type: "Brand + Product",
    className: "project-light",
  },
];

const INDUSTRIES = [
  "Education",
  "Restaurants",
  "Small Businesses",
  "Startups",
  "Professional Services",
  "Other",
];

const PROCESS = [
  "Discover",
  "Planning",
  "UI / UX Design",
  "Development",
  "Testing",
  "Launch",
  "Support",
];

/* =========================================
   CLOCK
========================================= */

function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " IST"
      );
    };

    update();

    const id = window.setInterval(update, 1000);

    return () => window.clearInterval(id);
  }, []);

  return time;
}

/* =========================================
   SCROLL REVEAL
========================================= */

function useReveal() {
  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/* =========================================
   PARALLAX
========================================= */

function useParallax(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;

    if (
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();

      const progress =
        (window.innerHeight / 2 -
          (rect.top + rect.height / 2)) /
        window.innerHeight;

      el.style.setProperty(
        "--parallax",
        `${progress * 28}px`
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);
}

/* =========================================
   COUNTER ANIMATION
========================================= */

function useCountUp(
  target: number,
  duration = 1800,
  start = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrame = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /* Smooth ease-out */
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setCount(
        Math.floor(target * easedProgress)
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, start]);

  return count;
}

/* =========================================
   ANIMATED NUMBER
========================================= */

function AnimatedNumber({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const count = useCountUp(
    value,
    1800,
    start
  );

  return (
    <strong className="animated-number">
      {count}
      <small>{suffix}</small>
    </strong>
  );
}

/* =========================================
   LOADER
========================================= */

function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDone(true);
    }, 1050);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className={`loader ${
        done ? "loader-out" : ""
      }`}
      aria-hidden="true"
    >
      <div className="loader-line" />

      <div className="loader-meta">
        <span>ASTRRA TECH</span>
        <span>01 — 100</span>
      </div>
    </div>
  );
}

/* =========================================
   CUSTOM CURSOR
========================================= */

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dot.current) {
        dot.current.style.transform =
          `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const enter = () => {
      dot.current?.classList.add(
        "cursor-large"
      );
    };

    const leave = () => {
      dot.current?.classList.remove(
        "cursor-large"
      );
    };

    window.addEventListener(
      "mousemove",
      move,
      {
        passive: true,
      }
    );

    const targets =
      document.querySelectorAll(
        "a,button,.service-row,.project"
      );

    targets.forEach((target) => {
      target.addEventListener(
        "mouseenter",
        enter
      );

      target.addEventListener(
        "mouseleave",
        leave
      );
    });

    return () => {
      window.removeEventListener(
        "mousemove",
        move
      );

      targets.forEach((target) => {
        target.removeEventListener(
          "mouseenter",
          enter
        );

        target.removeEventListener(
          "mouseleave",
          leave
        );
      });
    };
  }, []);

  return (
    <div
      ref={dot}
      className="cursor"
      aria-hidden="true"
    />
  );
}

/* =========================================
   ASTRRA TECH LOGO
========================================= */

function Brand({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <a
      className={`brand ${
        compact ? "brand-compact" : ""
      }`}
      href="#top"
      aria-label="ASTRRA TECH home"
    >
      <div className="brand-name">
        <span className="brand-main">
          ASTRRA
        </span>

        <span className="brand-tech">
          TECH
        </span>
      </div>

      {!compact && (
        <span className="brand-tagline">
          Make Your Space Digitally.
        </span>
      )}
    </a>
  );
}

/* =========================================
   HEADER
========================================= */

function Header() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] =
    useState(false);

  const time = useClock();

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener(
      "scroll",
      fn,
      {
        passive: true,
      }
    );

    fn();

    return () =>
      window.removeEventListener(
        "scroll",
        fn
      );
  }, []);

  return (
    <>
      <header
        className={`header ${
          scrolled
            ? "header-scrolled"
            : ""
        }`}
      >
        <Brand />

        <span className="header-time">
          {time}
        </span>

        <nav className="desktop-nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          className="header-cta"
          href="#contact"
        >
          Start a Project <span>↗</span>
        </a>

        <button
          className={`menu-toggle ${
            menu ? "open" : ""
          }`}
          onClick={() =>
            setMenu(!menu)
          }
          aria-label="Toggle menu"
        >
          <span />
          <span />
        </button>
      </header>

      <div
        className={`mobile-menu ${
          menu ? "open" : ""
        }`}
      >
        <div className="mobile-menu-top">
          <Brand compact />

          <button
            onClick={() =>
              setMenu(false)
            }
          >
            Close ×
          </button>
        </div>

        <nav>
          {[
            "About",
            "Services",
            "Work",
            "Process",
            "Contact",
          ].map((x, i) => (
            <a
              key={x}
              href={`#${x.toLowerCase()}`}
              style={
                {
                  "--i": i,
                } as CSSProperties
              }
              onClick={() =>
                setMenu(false)
              }
            >
              {x}

              <span>
                0{i + 1}
              </span>
            </a>
          ))}
        </nav>

        <p>
          Make Your Space Digitally.
        </p>
      </div>
    </>
  );
}

/* =========================================
   HERO
========================================= */

function Hero() {
  const artRef =
    useRef<HTMLDivElement>(null);

  useParallax(artRef);

  return (
    <section
      className="hero"
      id="top"
    >
      <div className="hero-copy">
        <div className="eyebrow hero-reveal">
          DIGITAL EXPERIENCE STUDIO / 2026
        </div>

        <h1 className="hero-title">
          <span className="hero-line">
            <span>MAKE</span>
          </span>

          <span className="hero-line">
            <span>
              YOUR <i>SPACE</i>
            </span>
          </span>

          <span className="hero-line">
            <span>DIGITALLY.</span>
          </span>
        </h1>

        <div className="hero-bottom-copy hero-reveal-delay">
          <p>
            We design and build distinctive
            digital experiences for ambitious
            businesses.
          </p>

          <a
            className="line-link"
            href="#work"
          >
            Explore our work{" "}
            <span>↓</span>
          </a>
        </div>
      </div>

      <div
        className="hero-art"
        ref={artRef}
      >
        <div className="art-grid" />

        <div className="art-ring ring-one" />
        <div className="art-ring ring-two" />

        <img
          src="/hero-robot.png"
          alt="Astrra Tech digital technology artwork"
          className="hero-robot"
        />

        <div className="art-top-label">
          ASTRRA / SYSTEM 01
        </div>

        <div className="art-side-label">
          DESIGN × TECHNOLOGY × MOTION
        </div>

        <div className="art-bottom-label">
          INDIA — GLOBAL / 2026
        </div>
      </div>

      <div className="hero-index">
        <span>01 / 08</span>
        <span>
          SCROLL TO DISCOVER
        </span>
        <span>ASTRRA TECH</span>
      </div>
    </section>
  );
}

/* =========================================
   ABOUT
========================================= */

function About() {
  return (
    <section
      className="about section-rule"
      id="about"
    >
      <div className="section-tag">
        01{" "}
        <span>
          ABOUT ASTRRA TECH
        </span>
      </div>

      <div className="about-content">
        <p
          className="editorial-statement"
          data-reveal
        >
          We build{" "}
          <em>digital spaces</em>{" "}
          that make ambitious brands
          impossible to ignore.
        </p>

        <p
          className="body-copy"
          data-reveal
        >
          ASTRRA TECH blends strategy,
          UI/UX design, engineering and
          motion into modern digital
          experiences. We turn complex
          ideas into clear, useful and
          memorable products.
        </p>

        <div
          className="about-line"
          data-reveal
        >
          <span>DESIGN</span>
          <span>TECHNOLOGY</span>
          <span>EXPERIENCE</span>
        </div>
      </div>

      <div className="side-note">
        FOUNDED IN INDIA
        <br />
        BUILT FOR THE WORLD
      </div>
    </section>
  );
}

/* =========================================
   SERVICES
========================================= */

function Services() {
  const [active, setActive] =
    useState(0);

  return (
    <section
      className="services"
      id="services"
    >
      <div className="services-intro">
        <div className="section-tag light">
          02{" "}
          <span>WHAT WE DO</span>
        </div>

        <h2 data-reveal>
          Ideas into{" "}
          <em>digital</em>{" "}
          experiences.
        </h2>

        <a
          className="outline-button"
          href="#contact"
        >
          Talk to ASTRRA{" "}
          <span>↗</span>
        </a>
      </div>

      <div className="services-list">
        {SERVICES.map((s, i) => (
          <article
            className={`service-row ${
              active === i
                ? "active"
                : ""
            }`}
            key={s.no}
            onMouseEnter={() =>
              setActive(i)
            }
            onFocus={() =>
              setActive(i)
            }
            tabIndex={0}
          >
            <span className="service-number">
              {s.no}
            </span>

            <div>
              <h3>{s.title}</h3>

              <p>{s.text}</p>
            </div>

            <span className="service-arrow">
              ↗
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

/* =========================================
   WORK
========================================= */

function Work() {
  return (
    <section
      className="work section-rule"
      id="work"
    >
      <div className="work-heading">
        <div className="section-tag">
          03{" "}
          <span>
            SELECTED WORK
          </span>
        </div>

        <h2 data-reveal>
          Built for{" "}
          <em>attention.</em>
        </h2>
      </div>

      <div className="project-grid">
        {PROJECTS.map((p, i) => (
          <article
            className={`project ${
              p.className
            } ${
              i === 0
                ? "project-featured"
                : ""
            }`}
            key={p.no}
            data-reveal
          >
            <div className="project-art">
              <span>{p.no}</span>

              <strong>{p.title}</strong>

              <div className="project-shape" />
            </div>

            <div className="project-meta">
              <b>
                {p.title.replace(
                  " / ",
                  " "
                )}
              </b>

              <span>{p.type}</span>

              <span>
                View ↗
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* =========================================
   METRICS
========================================= */

function Metrics() {
  const [started, setStarted] =
    useState(false);

  const ref =
    useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.3,
        }
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, []);

  const values = [
    {
      n: 50,
      s: "+",
      t: "PROJECTS",
    },
    {
      n: 30,
      s: "+",
      t: "BUSINESSES",
    },
    {
      n: 5,
      s: "+",
      t: "YEARS EXPERIENCE",
    },
    {
      n: 99,
      s: "%",
      t: "CLIENT SATISFACTION",
    },
  ];

  return (
    <section
      className="metrics"
      ref={ref}
    >
      {values.map((v, i) => (
        <div
          className={`metric metric-${i}`}
          key={v.t}
        >
          <AnimatedNumber
            value={v.n}
            suffix={v.s}
            start={started}
          />

          <span>{v.t}</span>
        </div>
      ))}
    </section>
  );
}

/* =========================================
   INDUSTRIES
========================================= */

function Industries() {
  const [active, setActive] =
    useState(0);

  return (
    <section className="industries section-rule">
      <div className="section-tag">
        04{" "}
        <span>INDUSTRIES</span>
      </div>

      <div className="industry-wrap">
        <h2 data-reveal>
          Digital for{" "}
          <em>real</em>{" "}
          business.
        </h2>

        <div className="industry-list">
          {INDUSTRIES.map(
            (item, i) => (
              <button
                key={item}
                className={
                  active === i
                    ? "active"
                    : ""
                }
                onMouseEnter={() =>
                  setActive(i)
                }
                onFocus={() =>
                  setActive(i)
                }
                onClick={() =>
                  setActive(i)
                }
              >
                <span>
                  0{i + 1}
                </span>

                {item}

                <b>↗</b>
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================
   PROCESS
========================================= */

function Process() {
  const [active, setActive] =
    useState(0);

  return (
    <section
      className="process"
      id="process"
    >
      <div className="process-left">
        <div className="section-tag light">
          05{" "}
          <span>OUR PROCESS</span>
        </div>

        <h2 data-reveal>
          From first{" "}
          <em>idea</em>{" "}
          to launch.
        </h2>
      </div>

      <div className="process-right">
        {PROCESS.map((p, i) => (
          <button
            key={p}
            className={
              active === i
                ? "active"
                : ""
            }
            onMouseEnter={() =>
              setActive(i)
            }
            onClick={() =>
              setActive(i)
            }
          >
            <span>
              {String(i + 1).padStart(
                2,
                "0"
              )}
            </span>

            <strong>{p}</strong>

            <i>
              {active === i
                ? "Active"
                : ""}
            </i>
          </button>
        ))}
      </div>
    </section>
  );
}

/* =========================================
   TESTIMONIAL
========================================= */

function Testimonial() {
  return (
    <section className="testimonial section-rule">
      <div className="section-tag">
        06{" "}
        <span>CLIENT VOICES</span>
      </div>

      <div>
        <blockquote data-reveal>
          “ASTRRA TECH didn't just
          redesign our website. They
          changed how we think about
          our{" "}
          <em>
            digital presence.
          </em>”
        </blockquote>

        <p data-reveal>
          — Founder, Technology Company
        </p>
      </div>
    </section>
  );
}

/* =========================================
   CONTACT
========================================= */

function Contact() {
  const [sent, setSent] =
    useState(false);

  return (
    <section
      className="contact"
      id="contact"
    >
      <div className="contact-head">
        <div className="section-tag light">
          07{" "}
          <span>
            START A CONVERSATION
          </span>
        </div>

        <div>
          <a href="mailto:hello@astrratech.com">
            hello@astrratech.com ↗
          </a>

          <a href="#">
            LinkedIn ↗
          </a>

          <a href="#">
            Instagram ↗
          </a>
        </div>
      </div>

      <div className="contact-main">
        <h2 data-reveal>
          Let's build
          <br />
          <em>something</em>
          <br />
          great.
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label>
            Name

            <input required />
          </label>

          <label>
            Business Name

            <input required />
          </label>

          <label>
            Email

            <input
              type="email"
              required
            />
          </label>

          <label>
            Required Service

            <select
              defaultValue=""
              required
            >
              <option
                value=""
                disabled
              >
                Select service
              </option>

              {SERVICES.map((s) => (
                <option key={s.no}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Project Description

            <textarea
              rows={3}
              required
            />
          </label>

          <button type="submit">
            {sent
              ? "Message Ready ✓"
              : "Send Enquiry ↗"}
          </button>
        </form>
      </div>

      <footer>
        <Brand compact />

        <span>
          MAKE YOUR SPACE DIGITALLY.
        </span>

        <span>
          © 2026 ASTRRA TECH
        </span>
      </footer>
    </section>
  );
}

/* =========================================
   APP
========================================= */

export default function App() {
  useReveal();

  return (
    <>
      <Loader />

      <Cursor />

      <Header />

      <main>
        <Hero />

        <About />

        <Services />

        <Work />

        <Metrics />

        <Industries />

        <Process />

        <Testimonial />

        <Contact />
      </main>
    </>
  );
}