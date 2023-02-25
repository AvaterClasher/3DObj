import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import {Center, Environment, Html, OrbitControls,Text3D, useGLTF } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { DepthOfField } from "@react-three/postprocessing";
import {Perf} from 'r3f-perf'
import {AiOutlineLine} from 'react-icons/ai'
import './App.css'


function Banana({ z }) {
  const ref = useRef();
  const { nodes, materials } = useGLTF("/apple.glb");

  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state) => {
    ref.current.rotation.set((data.rX += 0.01),(data.rY += 0.01),(data.rZ += 0.01));
    ref.current.position.set((data.x * width)-5, (data.y += 0.5), z);
    if (data.y > height / 1.5) {
      data.y = -height / 1.5;
    }
  });

  return (
    <mesh
      ref={ref}
      geometry={nodes.apple.geometry}
      material={materials.skin}
      rotation={[-Math.PI / 1, 0, 0]}
      scale={0.08}
    />
  );
}


export default function App({ count = 80,depth= 80 }) {
  return (
      <Canvas
        gl={{alpha:false}}

        camera={{
          fov: 60,
          near: 0.1,
          far: 110,
          position: [0,0,15],
        }}
      > 
        <color attach="background" args={["#FD8A8A"]} />
        <ambientLight intensity={0.2}/>
        <spotLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          {Array.from({ length:count },(_,i) => (
            <Banana key={i} z={-(i/count)*depth-5} />
          ))}
          <Html 
            fullscreen
          > <div className="back">
              <h1 className="heading"> Apple</h1>
              <p className="para__1">An apple is an edible fruit produced <br/>by an apple tree (Malus domestica).<br/>Apple trees are cultivated worldwide and <br/> are the most widely grown species in the genus Malus.</p>
              <h4 className="para__2">Made by {">"} Soumyadip Moni <br/> <a href="https://soumyadipmoni.vercel.app/">My Portfolio Website</a></h4>
            </div>
          </Html>
          <EffectComposer>
            <DepthOfField target={[0,0,depth/2]} focalLength={0.5} bokehScale={11} height={700}/>
          </EffectComposer>
        </Suspense>
      </Canvas>
  );
}
