'use client';

import { useEffect, useRef } from 'react';
import type * as THREE from 'three';

/* Lazy-loads three.js only after the card scrolls into view.
   This keeps it off the critical path (LCP / TTI not affected). */
export function ThreeDataGraph({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || cleanup || disposed) return;
        observer.disconnect();

        /* Respect reduced motion */
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* Dynamic import — three.js stays out of the initial bundle */
        const THREE = await import('three');
        if (disposed) return;

        const W = mount.clientWidth || 280;
        const H = mount.clientHeight || 180;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
        camera.position.z = 4.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        /* Nodes */
        const PALETTE = [0xFFC801, 0x4ADE80, 0xA78BFA, 0x38BDF8, 0xF87171, 0xFB923C];
        const NODE_COUNT = 20;
        const positions: THREE.Vector3[] = [];

        for (let i = 0; i < NODE_COUNT; i++) {
          const geo = new THREE.SphereGeometry(0.065 + Math.random() * 0.055, 8, 8);
          const mat = new THREE.MeshBasicMaterial({ color: PALETTE[i % PALETTE.length] });
          const mesh = new THREE.Mesh(geo, mat);
          /* Distribute on a sphere surface */
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 0.9 + Math.random() * 0.9;
          const pos = new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          );
          mesh.position.copy(pos);
          positions.push(pos);
          group.add(mesh);
        }

        /* Edges — connect nearby nodes */
        const lineMat = new THREE.LineBasicMaterial({ color: 0xFFC801, opacity: 0.18, transparent: true });
        for (let i = 0; i < NODE_COUNT; i++) {
          for (let j = i + 1; j < NODE_COUNT; j++) {
            if (positions[i].distanceTo(positions[j]) < 1.3) {
              const lineGeo = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
              group.add(new THREE.Line(lineGeo, lineMat));
            }
          }
        }

        /* Mouse hover brightness */
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const spheres = group.children.filter((c) => c instanceof THREE.Mesh) as THREE.Mesh[];

        const handleMouseMove = (e: MouseEvent) => {
          const rect = mount.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const hits = raycaster.intersectObjects(spheres);
          spheres.forEach((s) => {
            const mat = s.material as THREE.MeshBasicMaterial;
            mat.color.set(hits.length > 0 && hits[0].object === s
              ? 0xffffff
              : PALETTE[spheres.indexOf(s) % PALETTE.length]);
          });
        };
        mount.addEventListener('mousemove', handleMouseMove);

        let animId: number;
        let t = 0;

        const animate = () => {
          animId = requestAnimationFrame(animate);
          if (!prefersReduced) {
            t += 0.004;
            group.rotation.y = t;
            group.rotation.x = Math.sin(t * 0.38) * 0.22;
          }
          renderer.render(scene, camera);
        };
        animate();

        cleanup = () => {
          cancelAnimationFrame(animId);
          mount.removeEventListener('mousemove', handleMouseMove);
          renderer.dispose();
          if (renderer.domElement.parentNode === mount) {
            mount.removeChild(renderer.domElement);
          }
        };
      },
      { threshold: 0.1 }
    );

    observer.observe(mount);

    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', minHeight: 0 }}
    />
  );
}
