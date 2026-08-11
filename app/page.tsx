"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Children, Suspense, useRef, useState } from "react";
import type {
  MutableRefObject,
  ReactNode,
  UIEvent,
  WheelEvent,
} from "react";
import * as THREE from "three";

import { Arduino } from "../components/Arduino";
import { Desk } from "../components/Desk";
import { Laptop } from "../components/Laptop";

type Tech = {
  name: string;
  logo: string;
};

type Project = {
  title: string;
  image: string;
  description: string;
  githubUrl: string;
};

const projects: Project[] = [
  {
    title: "BUP Bus Tracking System",
    image: "/bupb.png",
    description:
      "Real-time bus tracking with an SSE/MQTT pipeline from ESP32 devices into a FastAPI + PostgreSQL backend.",
    githubUrl: "https://github.com/UltimateRayon/BUP-Bus-Tracking-System",
  },
  {
    title: "Sportify",
    image: "/Sportify.png",
    description:
      "Multi-sport platform (football, cricket) — React/TypeScript frontend on a Flask + Supabase Postgres backend.",
    githubUrl: "https://github.com/asmraiyan-crp/Sportify",
  },
  {
    title: "BD LogisticsFlow",
    image: "/logistics.png",
    description:
      "A logistics management system for BD Logistics, built with Next.js, django, and PostgreSQL, that implements maxflow algorithmn for route optimization.",
    githubUrl: "https://github.com/asmraiyan-crp/Hospital_mgmt",
  },
];

const techStack: Tech[] = [
  { name: "React", logo: "https://cdn.simpleicons.org/react" },
  { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/white" },
  { name: "FastAPI", logo: "https://cdn.simpleicons.org/fastapi" },
  { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql" },
  { name: "Flutter", logo: "https://cdn.simpleicons.org/flutter" },
  { name: "ESP32", logo: "https://cdn.simpleicons.org/espressif" },
  { name: "Arduino", logo: "https://cdn.simpleicons.org/arduino" },
  { name: "Tailwind CSS", logo: "https://cdn.simpleicons.org/tailwindcss" },
  {name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript" },
  {name: "Python", logo: "https://cdn.simpleicons.org/python" },
  {name: "Django", logo: "https://cdn.simpleicons.org/django" },
  {name: "Flask", logo: "https://cdn.simpleicons.org/flask" },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noreferrer"
      className="group block w-full h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-200"
    >
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-[58%] object-cover bg-white/10"
      />
      <div className="p-6 md:p-8 h-[42%]">
        <h3 className="text-2xl md:text-3xl font-semibold text-white">
          {project.title}
        </h3>
        <p className="text-base text-gray-300 mt-3 line-clamp-3 md:line-clamp-4">
          {project.description}
        </p>
        <span className="inline-block mt-5 text-base text-white underline underline-offset-4 group-hover:text-blue-400 transition-colors">
          View on GitHub →
        </span>
      </div>
    </a>
  );
}

function HorizontalScroller({ children }: { children: ReactNode }) {
  const lastWheelTimeRef = useRef(0);
  const slides = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const primaryDelta =
      Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (primaryDelta === 0) return;

    const now = Date.now();
    if (now - lastWheelTimeRef.current < 350) return;
    lastWheelTimeRef.current = now;

    setActiveIndex((current) => {
      const next = primaryDelta > 0 ? current + 1 : current - 1;
      return Math.max(0, Math.min(slides.length - 1, next));
    });
  };

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-[70vh] max-h-[680px] min-h-[420px] overflow-hidden overscroll-contain"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${(activeIndex - index) * 100}%)` }}
        >
          {slide}
        </div>
      ))}
    </div>
  );
}

function TechBox({ tech }: { tech: Tech }) {
  return (
    <div className="flex flex-col items-center justify-center w-24 h-24 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors">
      <img src={tech.logo} alt={tech.name} className="w-8 h-8 mb-2" />
      <span className="text-xs text-gray-300">{tech.name}</span>
    </div>
  );
}

function CameraRig({
  scrollProgressRef,
}: {
  scrollProgressRef: MutableRefObject<number>;
}) {
  const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const offset = scrollProgressRef.current;
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (offset < 0.25) {
      targetPos.set(0, 5, 7);
      targetLook.set(0, 0, 0);
    } else if (offset < 0.5) {
      targetPos.set(-1.5, 1.5, 1.5);
      targetLook.set(-1.5, 0.5, 0);
    } else if (offset < 0.75) {
      targetPos.set(1.5, 1.2, 1.5);
      targetLook.set(1.5, 0.2, 0);
    } else {
      targetPos.set(0, 8, 10);
      targetLook.set(0, -5, 0);
    }

    state.camera.position.lerp(targetPos, 0.04);
    lookAtPos.current.lerp(targetLook, 0.04);
    state.camera.lookAt(lookAtPos.current);
  });

  return null;
}

function MessyDeskEnvironment() {
  return (
    <>
      <ambientLight intensity={0.15} color="#3b3f57" />
      <spotLight
        position={[2, 6, 2]}
        angle={0.4}
        penumbra={0.5}
        intensity={2}
        castShadow
        color="#fef3c7"
      />

      <Desk position={[0, -1, 0]} scale={1} receiveShadow />
      <Laptop position={[-1.5, -0.3, 0]} scale={0.6} castShadow />
      <Arduino position={[1.5, -0.5, 0]} scale={0.5} castShadow />

      <pointLight
        position={[-1.5, 0.3, -0.2]}
        intensity={1.5}
        distance={1.5}
        color="#38bdf8"
      />

      <pointLight
        position={[1.5, -0.2, 0.2]}
        intensity={0.8}
        distance={0.6}
        color="#22c55e"
      />
    </>
  );
}

export default function Portfolio() {
  const scrollProgressRef = useRef(0);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const scrollableHeight = element.scrollHeight - element.clientHeight;
    if (scrollableHeight <= 0) {
      scrollProgressRef.current = 0;
      return;
    }
    scrollProgressRef.current = element.scrollTop / scrollableHeight;
  };

  return (
    <div className="relative h-screen overflow-y-auto bg-black" onScroll={handleScroll}>
      <div className="sticky top-0 h-screen">
        <Canvas shadows camera={{ position: [0, 5, 7], fov: 45 }}>
          <Suspense fallback={null}>
            <CameraRig scrollProgressRef={scrollProgressRef} />
            <MessyDeskEnvironment />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <section className="h-screen flex items-center justify-between gap-10 px-6 md:px-16 text-white">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold">A S M Raiyan</h1>
            <p className="mt-4 max-w-md text-gray-300">
              CS student at BUP. Building the bridge between scalable web
              applications and physical hardware.
            </p>
            <span className="mt-8 inline-block text-sm text-gray-400 animate-bounce">
              ↓ Scroll to explore workspace
            </span>
          </div>

          <div className="hidden md:block w-[300px] h-[300px] lg:w-[260px] lg:h-[360px] rounded-2xl overflow-hidden border border-white/20 bg-white/5 md:-translate-x-40">
            <img
              src="/n2.png"
              alt="A S M Raiyan"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="h-screen flex flex-col justify-center px-6 md:px-16 text-white">
          <h2 className="text-3xl font-semibold mb-2">Developments</h2>
          <p className="text-gray-300 mb-6 max-w-md">
            A few things I&apos;ve built — scroll to move cards one by one.
          </p>
          <HorizontalScroller>
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </HorizontalScroller>
        </section>

        <section className="h-screen flex flex-col justify-center items-center px-16 text-white">
          <h2 className="text-3xl font-semibold mb-6">Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md">
            {techStack.map((tech) => (
              <TechBox key={tech.name} tech={tech} />
            ))}
          </div>
        </section>

        <section className="h-screen flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl font-semibold mb-6">Let&apos;s Build Something</h2>
          <div className="flex gap-6">
            <a
              href="https://github.com/asmraiyan-crp"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/a-s-m-raiyan-3abb2a26a/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="asmraiyan@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              Email
            </a>
            
          </div>
          <a href="/24524203178_cv.pdf" className="button-link" target="_blank" rel="noreferrer">
              my CV
            </a>
        </section>
      </div>
    </div>
  );
}
