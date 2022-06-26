import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useCursor, Text } from '@react-three/drei'

import human from './models/human.glb'

function ModelLoader(props) {
    const v = new THREE.Vector3()
    const ref = useRef()
    const { nodes, materials } = useGLTF(props.modelName)

    console.log('==nodes==')
    console.log(nodes)

    const [active, setActive] = useState(false)
    const [zoom, set] = useState(false)

    const shinyMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(
            props.activeItem === props.section
                ? props.selectedColor
                : props.color
        ).convertSRGBToLinear(),
        roughness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0,
    })

    useCursor(active)

    useFrame((state, delta) => {
        ref.current.position.lerp(
            v.set(
                props.activeItem == null
                    ? props.position[0]
                    : props.activeItem === props.section
                    ? 0
                    : props.position[0],

                props.activeItem == null
                    ? props.position[1]
                    : props.activeItem === props.section
                    ? props.position[1] - 3
                    : -20,

                props.activeItem == null
                    ? props.position[2]
                    : props.activeItem === props.section
                    ? 55
                    : props.position[2]
            ),
            0.05
        )
        if (
            props.activeItem === props.section &&
            ref.current.rotation.z % (Math.PI * 2) <= 0.15
        ) {
        } else {
            ref.current.rotation.z = ref.current.rotation.z += delta * 1.5
        }
    })

    return (
        <>
            <mesh
                ref={ref}
                {...props}
                onClick={() => {
                    set(!zoom)
                    props.selectObj(props.section)
                }}
                onPointerOver={() => setActive(true)}
                onPointerOut={() => setActive(false)}
                receiveShadow
                castShadow
                geometry={nodes[props.modelExtension]?.geometry}
                rotation={[Math.PI / 2, 0, 0]}
                material={shinyMaterial}
            ></mesh>
            <Text
                position={[props.position[0] * 0.9, 3, props.position[2] + 15]}
                lineHeight={0.8}
                font='/Ki-Medium.ttf'
                fontSize={2}
                material-toneMapped={false}
                anchorX='center'
                anchorY='middle'
                fillOpacity={props.activeItem === null ? 1 : 0}
                color={'#ffffff'}
            >
                {props.section}
            </Text>
        </>
    )
}

export default ModelLoader
