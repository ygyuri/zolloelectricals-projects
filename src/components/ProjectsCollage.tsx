'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import projectsDataFallback from '@/data/projects.json';
import type { Project } from '@/types/project';

type LayoutId = 'grid' | 'masonry' | 'bento' | 'featured' | 'staggered';

const LAYOUTS: { id: LayoutId; label: string; icon: string }[] = [
  { id: 'grid', label: 'Grid', icon: '⊞' },
  { id: 'masonry', label: 'Masonry', icon: '▦' },
  { id: 'bento', label: 'Bento', icon: '▤' },
  { id: 'featured', label: 'Featured', icon: '◆' },
  { id: 'staggered', label: 'Staggered', icon: '◇' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      delay: i * 0.04,
    },
  }),
};

function ProjectCard({
  project,
  index,
  size = 'normal',
}: {
  project: Project;
  index: number;
  size?: 'normal' | 'large' | 'small';
}) {
  const imgUrl = project.imageUrl || '';
  const alt = project.title;
  const sizeClasses = {
    normal: 'aspect-[4/3]',
    large: 'aspect-[3/4] min-h-[280px]',
    small: 'aspect-square',
  };

  return (
    <motion.article
      layout
      variants={item}
      custom={index}
      initial="hidden"
      animate="show"
      className="group overflow-hidden rounded-2xl bg-card-bg shadow-xl ring-1 ring-white/10"
    >
      <div className={`relative overflow-hidden ${sizeClasses[size]}`}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-1/80 text-accent-yellow/70">
            <span className="text-4xl">☀</span>
          </div>
        )}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-primary-1/90 via-primary-1/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 md:p-5"
          initial={false}
        >
          <h3 className="text-lg font-semibold leading-tight drop-shadow-md md:text-xl text-white">
            {project.title}
          </h3>
          {project.description && size !== 'small' && (
            <p className="mt-1 line-clamp-2 text-sm text-white/90">
              {project.description.length > 100
                ? project.description.slice(0, 100) + '…'
                : project.description}
            </p>
          )}
          {project.category?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.category.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-accent-yellow/90 px-2 py-0.5 text-xs font-medium text-primary-1"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.article>
  );
}

export function ProjectsCollage() {
  const [layout, setLayout] = useState<LayoutId>('grid');
  const [projects, setProjects] = useState<Project[]>(projectsDataFallback as Project[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-primary-1 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="mb-8 text-center">
            <p className="text-white/70">Loading projects…</p>
          </div>
        )}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Our Projects
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Lighting design and electrical work for schools, homes, hotels, and high-end venues.
          </p>
        </motion.div>

        <motion.div
          className="mb-10 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout(l.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                layout === l.id
                  ? 'bg-accent-blue text-white shadow-lg hover:bg-accent-blue/90'
                  : 'bg-white/10 text-white hover:bg-accent-blue ring-1 ring-white/20'
              }`}
            >
              <span className="mr-2 opacity-90">{l.icon}</span>
              {l.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {layout === 'grid' && (
            <motion.div
              key="grid"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          )}

          {layout === 'masonry' && (
            <motion.div
              key="masonry"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
            >
              {projects.map((project, i) => (
                <div key={project.id} className="break-inside-avoid">
                  <ProjectCard project={project} index={i} size="small" />
                </div>
              ))}
            </motion.div>
          )}

          {layout === 'bento' && (
            <motion.div
              key="bento"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(160px,auto)]"
            >
              {projects.map((project, i) => {
                const isBig = i % 5 === 0 || i % 6 === 1;
                return (
                  <div
                    key={project.id}
                    className={
                      i % 5 === 0
                        ? 'col-span-2 row-span-2'
                        : i % 6 === 1
                          ? 'row-span-2'
                          : ''
                    }
                  >
                    <ProjectCard
                      project={project}
                      index={i}
                      size={isBig ? 'large' : 'normal'}
                    />
                  </div>
                );
              })}
            </motion.div>
          )}

          {layout === 'featured' && (
            <motion.div
              key="featured"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:auto-rows-fr"
            >
              {projects.slice(0, 1).map((project, i) => (
                <div key={project.id} className="md:row-span-2 min-h-[280px]">
                  <ProjectCard project={project} index={i} size="large" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-5">
                {projects.slice(1, 5).map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i + 1}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {layout === 'staggered' && (
            <motion.div
              key="staggered"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  style={{
                    marginLeft: i % 2 === 1 ? '1.5rem' : 0,
                    marginTop: i % 3 === 1 ? '1rem' : 0,
                  }}
                >
                  <ProjectCard project={project} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
