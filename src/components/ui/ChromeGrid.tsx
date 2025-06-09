'use client'

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ExtrudeGeometry, Shape } from 'three'
import * as THREE from 'three'

interface BoxProps {
  position: [number, number, number];
  width?: number;
  length?: number;
  cornerRadius?: number;
  gridPosition: [number, number];
}

const Box = React.memo(({ 
    position, 
    width = 4, 
    length = 4, 
    cornerRadius = 2,
    gridPosition
}: BoxProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    const geometry = useMemo(() => {
        const shape = new Shape();
        const angleStep = Math.PI * 0.5;
        const radius = cornerRadius;
        
        const halfWidth = width / 2;
        const halfLength = length / 2;

        shape.absarc(halfWidth - radius, halfLength - radius, radius, angleStep * 0, angleStep * 1);
        shape.absarc(-halfWidth + radius, halfLength - radius, radius, angleStep * 1, angleStep * 2);
        shape.absarc(-halfWidth + radius, -halfLength + radius, radius, angleStep * 2, angleStep * 3);
        shape.absarc(halfWidth - radius, -halfLength + radius, radius, angleStep * 3, angleStep * 4);

        const extrudeSettings = {
            depth: 0.3,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 8, // Reduced from 20
            curveSegments: 8  // Reduced from 20
        };

        const geometry = new ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        
        return geometry;
    }, [width, length, cornerRadius]);
    
    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);

    // Optimized animation with reduced frequency
    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            const x = gridPosition[0];
            const z = gridPosition[1];
            
            // Create subtle wave animation based on grid position
            const waveOffset = (x + z) * 0.3;
            const floatY = Math.sin(time * 0.3 + waveOffset) * 0.05; // Reduced amplitude and frequency
            
            meshRef.current.position.y = position[1] + floatY;
        }
    });

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.userData.gridPosition = gridPosition;
        }
    }, [gridPosition]);

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
        >
            <meshPhysicalMaterial 
                color="#232323" 
                roughness={0.5} 
                metalness={1}
                clearcoat={1}
                clearcoatRoughness={0}
            />
        </mesh>
    );
});

Box.displayName = 'Box';

const GridOfBoxes = React.memo(() => {
  const gridSize = 8; // Reduced from 10
  const boxWidth = 4;
  const boxLength = 4;
  const gap = 0.05;
  const spacingX = boxWidth + gap;
  const spacingZ = boxLength + gap;
   
  const boxes = useMemo(() => {
    const boxArray = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const posX = (x - (gridSize - 1) / 2) * spacingX;
        const posZ = (z - (gridSize - 1) / 2) * spacingZ;
        
        boxArray.push(
          <Box 
            key={`${x}-${z}`} 
            position={[posX, -0.85, posZ]}
            width={boxWidth}
            length={boxLength}
            cornerRadius={0.8}
            gridPosition={[x, z]}
          />
        );
      }
    }
    return boxArray;
  }, [gridSize, spacingX, spacingZ]);

  return <>{boxes}</>;
});

GridOfBoxes.displayName = 'GridOfBoxes';

export const ChromeGrid = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay rendering to improve initial load
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return <div className="h-full w-full bg-black relative z-0 pointer-events-none" />;
  }

  return (
    <div className="h-full w-full bg-black relative z-0 pointer-events-none">
      <Canvas 
        camera={{ 
          position: [-9.31, 12, 24.72], 
          rotation: [-0.65, -0.2, -0.13],
          fov: 35 
        }}
        style={{ pointerEvents: 'none' }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Performance monitoring
      >
        <ambientLight intensity={0.8} /> {/* Reduced intensity */}
        
        <directionalLight 
          position={[10, 15, 10]} 
          intensity={8} // Reduced intensity
          castShadow={false} // Disabled shadows for performance
        />
        
        <directionalLight 
          position={[-10, 10, -5]} 
          intensity={6} // Reduced intensity
          color="#ffffff"
        />
        
        <pointLight 
          position={[0, 20, 3]} 
          intensity={1.5} // Reduced intensity
          distance={40} // Reduced distance
        />
                  
        <GridOfBoxes />        
      </Canvas>
    </div>
  )
});

ChromeGrid.displayName = 'ChromeGrid';