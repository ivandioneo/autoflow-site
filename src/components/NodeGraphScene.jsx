import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 55;
const CONNECT_DIST = 0.38;
const TEAL = new THREE.Color('#14B8A6');
const SAND = new THREE.Color('#F5F0E8');
const LINE_OPACITY = 0.08;

/**
 * Generates random node positions on a unit sphere surface.
 * Keeps nodes spread so the graph reads as a flow network,
 * not a random scatter.
 */
function generateNodes(count) {
  return Array.from({ length: count }, () => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.4 + Math.random() * 0.6;
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  });
}

function Graph({ mouseRef }) {
  const groupRef = useRef();
  const nodes = useMemo(() => generateNodes(NODE_COUNT), []);

  // Build line segments between nearby nodes
  const linePositions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < CONNECT_DIST * 4) {
          pts.push(nodes[i].x, nodes[i].y, nodes[i].z);
          pts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    return new Float32Array(pts);
  }, [nodes]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Slow drift rotation
    groupRef.current.rotation.y = t * 0.04;
    groupRef.current.rotation.x = Math.sin(t * 0.025) * 0.12;
    // Subtle cursor parallax
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    groupRef.current.rotation.y += mx * 0.06;
    groupRef.current.rotation.x += my * 0.04;
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={TEAL}
          transparent
          opacity={LINE_OPACITY}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.018 + (i % 4) * 0.006, 8, 8]} />
          <meshBasicMaterial
            color={i % 5 === 0 ? SAND : TEAL}
            transparent
            opacity={0.55 + (i % 3) * 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function NodeGraphScene() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 4.5], fov: 55 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'low-power', // battery-friendly on mobile
      }}
      dpr={[1, 1.5]} // cap pixel ratio — no 3x retina GPU tax
    >
      <ambientLight intensity={0.4} />
      <Graph mouseRef={mouseRef} />
    </Canvas>
  );
}
