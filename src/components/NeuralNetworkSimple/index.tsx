import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type PerformanceTier = "high" | "low";

function detectPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return "high";
  const isMobileOrTablet =
    window.innerWidth < 1024 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return isMobileOrTablet ? "low" : "high";
}

const NODE_COUNTS = {
  high: 24,
  low: 12,
};

interface SimpleNode {
  id: number;
  basePosition: THREE.Vector3;
  currentPosition: THREE.Vector3;
  size: number;
  connections: SimpleNode[];
  glowSpeed: number;
  scale: number;
}

interface ConnectionPair {
  id: number;
  start: SimpleNode;
  end: SimpleNode;
  animationOffset: number;
}

const _diff = new THREE.Vector3();
const _centerPull = new THREE.Vector3();
const _noise = new THREE.Vector3();

const SimpleNodeMesh = React.memo(function SimpleNodeMesh({
  node,
  color,
  performanceTier,
}: {
  node: SimpleNode;
  color: string;
  performanceTier: PerformanceTier;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const currentScaleRef = useRef(0);

  const isHighTier = performanceTier === "high";
  const sphereSegments = isHighTier ? 32 : 16;
  const sphereRings = isHighTier ? 16 : 8;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.copy(node.currentPosition);

      const targetScale = node.scale;
      const diff = targetScale - currentScaleRef.current;
      if (Math.abs(diff) > 0.001) {
        currentScaleRef.current += diff * 0.1;
      } else {
        currentScaleRef.current = targetScale;
      }
      groupRef.current.scale.setScalar(currentScaleRef.current);
    }

    if (isHighTier && meshRef.current) {
      const time = state.clock.getElapsedTime();
      const glow = 0.5 + Math.sin(time * node.glowSpeed) * 0.5;
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissiveIntensity = 0.8 + glow * 0.4;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {isHighTier && (
        <Sphere args={[node.size * 1.5, 16, 16]}>
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </Sphere>
      )}
      <Sphere ref={meshRef} args={[node.size, sphereSegments, sphereRings]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          metalness={0.6}
          roughness={0.2}
        />
      </Sphere>
    </group>
  );
});

const SimpleConnection = React.memo(function SimpleConnection({
  startNode,
  endNode,
  animationOffset,
  color,
  disableAnimation,
}: {
  startNode: SimpleNode;
  endNode: SimpleNode;
  animationOffset: number;
  color: string;
  disableAnimation?: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const glowSegments = useRef<THREE.Line[]>([]);

  const [baseLine] = useState(() => {
    const points = [
      startNode.currentPosition.clone(),
      endNode.currentPosition.clone(),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.25,
    });
    return new THREE.Line(geometry, material);
  });

  const [glowLines] = useState(() => {
    if (disableAnimation) return [];
    const points = [
      startNode.currentPosition.clone(),
      endNode.currentPosition.clone(),
    ];
    return Array.from({ length: 11 }, () => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
      });
      return new THREE.Line(geometry, material);
    });
  });

  useEffect(() => {
    return () => {
      if (baseLine.geometry) baseLine.geometry.dispose();
      if (baseLine.material instanceof THREE.Material)
        baseLine.material.dispose();
      glowLines.forEach((line) => {
        if (line.geometry) line.geometry.dispose();
        if (line.material instanceof THREE.Material) line.material.dispose();
      });
    };
  }, [baseLine, glowLines]);

  useFrame((state) => {
    const startScale = startNode.scale ?? 0;
    const endScale = endNode.scale ?? 0;
    const connectionOpacity = Math.min(startScale, endScale);

    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position;
      positions.setXYZ(
        0,
        startNode.currentPosition.x,
        startNode.currentPosition.y,
        startNode.currentPosition.z
      );
      positions.setXYZ(
        1,
        endNode.currentPosition.x,
        endNode.currentPosition.y,
        endNode.currentPosition.z
      );
      positions.needsUpdate = true;

      if (lineRef.current.material instanceof THREE.LineBasicMaterial) {
        lineRef.current.material.opacity = 0.25 * connectionOpacity;
      }
    }

    if (disableAnimation) return;

    const time = state.clock.getElapsedTime();
    const progress = (time * 0.4 + animationOffset) % 1;
    const fadeIn = Math.min(progress * 5, 1);
    const fadeOut = Math.min((1 - progress) * 5, 1);
    const baseFade = Math.min(fadeIn, fadeOut);

    glowSegments.current.forEach((segment, idx) => {
      if (segment) {
        const centerIdx = 5;
        const layerOffset = (idx - centerIdx) * 0.015;
        const segmentProgress = progress + layerOffset;
        const segmentHalfLength = 0.025;

        const startX =
          startNode.currentPosition.x +
          (endNode.currentPosition.x - startNode.currentPosition.x) *
            Math.max(0, Math.min(1, segmentProgress - segmentHalfLength));
        const startY =
          startNode.currentPosition.y +
          (endNode.currentPosition.y - startNode.currentPosition.y) *
            Math.max(0, Math.min(1, segmentProgress - segmentHalfLength));
        const startZ =
          startNode.currentPosition.z +
          (endNode.currentPosition.z - startNode.currentPosition.z) *
            Math.max(0, Math.min(1, segmentProgress - segmentHalfLength));

        const endX =
          startNode.currentPosition.x +
          (endNode.currentPosition.x - startNode.currentPosition.x) *
            Math.max(0, Math.min(1, segmentProgress + segmentHalfLength));
        const endY =
          startNode.currentPosition.y +
          (endNode.currentPosition.y - startNode.currentPosition.y) *
            Math.max(0, Math.min(1, segmentProgress + segmentHalfLength));
        const endZ =
          startNode.currentPosition.z +
          (endNode.currentPosition.z - startNode.currentPosition.z) *
            Math.max(0, Math.min(1, segmentProgress + segmentHalfLength));

        const positions = segment.geometry.attributes.position;
        positions.setXYZ(0, startX, startY, startZ);
        positions.setXYZ(1, endX, endY, endZ);
        positions.needsUpdate = true;

        const distanceFromCenter = Math.abs(idx - centerIdx);
        const normalizedDistance = distanceFromCenter / centerIdx;
        const opacityMultiplier = Math.pow(1 - normalizedDistance, 2.5);

        if (segment.material instanceof THREE.LineBasicMaterial) {
          segment.material.opacity =
            baseFade * opacityMultiplier * 0.8 * connectionOpacity;
        }
      }
    });
  });

  return (
    <group>
      <primitive object={baseLine} ref={lineRef} />
      {glowLines.map((glowLine, i) => (
        <primitive
          key={`glow-${i}`}
          object={glowLine}
          ref={(el: THREE.Line) => {
            if (el) glowSegments.current[i] = el;
          }}
        />
      ))}
    </group>
  );
});

function NetworkScene({
  color = "#00FFD1",
  nodeCount = 12,
  autoRotate = false,
  rotationSpeed = 0.15,
  performanceTier = "high",
}: {
  color?: string;
  nodeCount?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  performanceTier?: PerformanceTier;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [nodes, setNodes] = useState<SimpleNode[]>([]);
  const [connections, setConnections] = useState<ConnectionPair[]>([]);
  const nodesRef = useRef<SimpleNode[]>([]);
  const velocitiesRef = useRef<Map<number, THREE.Vector3>>(new Map());

  const isHighTier = performanceTier === "high";

  useEffect(() => {
    const generated: SimpleNode[] = [];
    const radius = 2.0;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    generated.push({
      id: 0,
      basePosition: new THREE.Vector3(0, 0, 0),
      currentPosition: new THREE.Vector3(0, 0, 0),
      size: 0.12 + Math.random() * 0.06,
      connections: [],
      glowSpeed: 1 + Math.random() * 1.5,
      scale: 1,
    });

    for (let i = 0; i < nodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);

      const r = radius * (0.95 + Math.random() * 0.1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      generated.push({
        id: i + 1,
        basePosition: new THREE.Vector3(x, y, z),
        currentPosition: new THREE.Vector3(x, y, z),
        size: 0.06 + Math.random() * 0.06,
        connections: [],
        glowSpeed: 1.5 + Math.random() * 2.5,
        scale: 1,
      });
    }

    const connectionPairs: ConnectionPair[] = [];
    let connId = 0;

    for (let i = 1; i < generated.length; i++) {
      const node = generated[i];
      const sorted = generated
        .slice(0, i)
        .map((n) => ({
          node: n,
          dist: node.basePosition.distanceTo(n.basePosition),
        }))
        .sort((a, b) => a.dist - b.dist);

      const targets = sorted
        .slice(0, Math.min(sorted.length, 2))
        .map((item) => item.node);

      targets.forEach((target) => {
        node.connections.push(target);
        target.connections.push(node);
        connectionPairs.push({
          id: connId++,
          start: node,
          end: target,
          animationOffset: Math.random() * 10,
        });
      });
    }

    nodesRef.current = generated;
    setNodes(generated);
    setConnections(connectionPairs);

    return () => {
      nodesRef.current = [];
      velocitiesRef.current.clear();
      setNodes([]);
      setConnections([]);
    };
  }, [nodeCount]);

  const getVelocity = (id: number) => {
    if (!velocitiesRef.current.has(id)) {
      velocitiesRef.current.set(id, new THREE.Vector3(0, 0, 0));
    }
    return velocitiesRef.current.get(id)!;
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const delta = Math.min(state.clock.getDelta(), 0.1);

    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y = time * rotationSpeed;
    }

    if (!isHighTier) return;

    const REPULSION = 0.6;
    const SPRING_STRENGTH = 0.04;
    const CENTERING = 0.015;
    const DAMPING = 0.94;
    const NOISE_STRENGTH = 0.025;

    const visibleNodes = nodesRef.current.filter((n) => n.scale > 0.01);

    visibleNodes.forEach((node) => {
      const vel = getVelocity(node.id);
      const pos = node.currentPosition;

      visibleNodes.forEach((other) => {
        if (node === other) return;
        _diff.subVectors(pos, other.currentPosition);
        let dist = _diff.length();
        if (dist < 0.1) dist = 0.1;
        if (dist < 2.5) {
          _diff.normalize().multiplyScalar((REPULSION / (dist * dist)) * delta);
          vel.add(_diff);
        }
      });

      node.connections.forEach((neighbor) => {
        if (neighbor.scale > 0.01) {
          _diff.subVectors(neighbor.currentPosition, pos);
          const dist = _diff.length();
          const restLength = 1.2;
          const stretch = dist - restLength;
          _diff.normalize().multiplyScalar(stretch * SPRING_STRENGTH * delta);
          vel.add(_diff);
        }
      });

      _centerPull.subVectors(node.basePosition, pos);
      vel.add(_centerPull.multiplyScalar(CENTERING * delta));

      _noise.set(
        Math.sin(time * 2 + node.id) * NOISE_STRENGTH,
        Math.cos(time * 1.5 + node.id) * NOISE_STRENGTH,
        Math.sin(time * 2.5 + node.id) * NOISE_STRENGTH
      );
      vel.add(_noise);
    });

    visibleNodes.forEach((node) => {
      const vel = getVelocity(node.id);
      vel.multiplyScalar(DAMPING);
      node.currentPosition.add(vel.clone().multiplyScalar(delta * 10));
    });
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color={color} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={color} />

      {connections.map((conn) => (
        <SimpleConnection
          key={`conn-${conn.id}`}
          startNode={conn.start}
          endNode={conn.end}
          animationOffset={conn.animationOffset}
          color={color}
          disableAnimation={!isHighTier}
        />
      ))}

      {nodes.map((node) => (
        <SimpleNodeMesh
          key={`node-${node.id}`}
          node={node}
          color={color}
          performanceTier={performanceTier}
        />
      ))}
    </group>
  );
}

interface NeuralNetworkSimpleProps {
  width?: number;
  height?: number;
  color?: string;
  nodeCount?: number;
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  performanceTier?: PerformanceTier;
}

export default function NeuralNetworkSimple({
  width = 200,
  height = 200,
  color = "#00FFD1",
  nodeCount,
  className = "",
  autoRotate = false,
  rotationSpeed = 0.15,
  performanceTier,
}: NeuralNetworkSimpleProps) {
  const [detectedTier, setDetectedTier] = useState<PerformanceTier>("high");

  useEffect(() => {
    setDetectedTier(detectPerformanceTier());
  }, []);

  const tier = performanceTier ?? detectedTier;
  const effectiveNodeCount = nodeCount ?? NODE_COUNTS[tier];

  return (
    <div style={{ width, height }} className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <NetworkScene
          color={color}
          nodeCount={effectiveNodeCount}
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          performanceTier={tier}
        />
      </Canvas>
    </div>
  );
}
