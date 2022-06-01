import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, ContactShadows, Html } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { a as three } from '@react-spring/three'
import { a as web } from '@react-spring/web'
import LaptopScreen from '../2d_components/laptopScreen'

const vec = new THREE.Vector3()

// function Model({ open, hinge, laptopChange, ...props }) {
function Model(props) {
    const group = useRef()
    const { nodes, materials } = useGLTF('/mac-draco.glb')
    const [hovered, setHovered] = useState(false)
    
    useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered])
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, props.open ? Math.cos(t / 2) / 8 + 0.25 : 0, 0.1)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, props.open ? Math.sin(t / 4) / 4 : 0, 0.1)
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, props.open ? Math.sin(t / 4) / 4 : 0, 0.1)
        
        // group.current.rotation.copy(state.camera.rotation)

        // I was using these
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, props.open ? 0 : -25, 0.007)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, props.open ? 0 : 60, 0.007)
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, props.open ? -3 : -75, 0.014)
        
        
        // group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, open ? 0 : 4, 0.02)
        // group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, open ? -2 : -53, 0.04)

        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, props.open ? 0.2 : Math.PI/2, 0.06)
    })

    console.log(props.laptopChange)
    // The view was auto-generated by: https://github.com/pmndrs/gltfjsx
    // Events and spring animations were added afterwards
    return (
        <group
            ref={group}
            {...props}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={(e) => setHovered(false)}
            dispose={null}
        >
            <three.group rotation-x={props.hinge} position={[0, -0.04, 0.41]}>
                <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
                    <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
                    <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
                    <mesh material={materials['screen.001']} geometry={nodes['Cube008_2'].geometry} >
                        <Html 
                            scale={1} 
                            rotation-x={-Math.PI/2} 
                            position={[0, 0.05, -0.09]}
                            transform 
                            occlude
                        >
                            <LaptopScreen 
                            laptopChange={props.laptopChange}
                                everything = {function() {
                                    console.log('not right now')}
                                }
                            />
                        </Html>
                    </mesh>
                </group>
            </three.group>
            <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
            <group position={[0, -0.1, 3.39]}>
                <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
                <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
            </group>
            <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
        </group>
    )
}

export default function LaptopLoader() {
    const [open, setOpen] = useState(true)

    // spring animation interpolates between 0 and 1
    const props = useSpring({ open: Number(open) })

    const laptopChange = function() {
        setOpen(!open)
    }

    return (   
        <group
            onClick={(e) => {
                e.stopPropagation()
                laptopChange()
            }}
            position={[0, 6.3, 77]}
        >
            <Model 
                open={open} 
                hinge={props.open.to([0, 1], [1.575, -0.25])}
                laptopChange={laptopChange}
            />
        </group>
  )
}