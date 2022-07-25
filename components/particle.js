import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {div} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import style from "../styles/Style.module.css";
import {AdditiveBlending} from "three";

export default function Particle() {
    const [renderer, setRenderer] = useState()
    const [camera, setCamera] = useState()
    const refContainer = useRef(null)
    let pointLight, controls;

    //ブラウザのリサイズに対応
    const onWindowResize = useCallback(() => {
        const {current: container} = refContainer
        if (renderer) {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
    }, [renderer])

    useEffect(() => {
        window.addEventListener('resize', onWindowResize, false)
    }, [renderer])

    useEffect(() => {
        const {current: container} = refContainer
        //レンダラー
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement)
        setRenderer(renderer)

        //シーン
        const scene = new THREE.Scene();

        //カメラ
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.set(1, 1, 2);
        setCamera(camera)


        /**
         * テクスチャ設定
         */
        const textureLoader = new THREE.TextureLoader()
        const particlesTexture = textureLoader.load('textures/particles/6.png')

        /**
         * パーティクルを作ってみよう
         */

            //ジオメトリ
        const particlesGeometry = new THREE.BufferGeometry()

        //パーティクルの設定
        const count = 10000
        //x,y,z座標をそれぞれ用意
        const positionArray = new Float32Array(count * 3)
        const colorArray = new Float32Array(count * 3)
        for (let i = 0; i < count * 3; i++) {
            positionArray[i] = (Math.random() - 0.5) * 10
            colorArray[i] = Math.random()
        }
        particlesGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positionArray, 3)
        )

        particlesGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colorArray, 3)
        )


        //マテリアル
        const pointMaterial = new THREE.PointsMaterial({
            size: 0.05,
            sizeAttenuation: true,
            alphaMap: particlesTexture,
            transparent: true,
            // alphaTest:0.001,
            // depthTest:false,
            depthWrite: false,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
        })
        // pointMaterial.color.set('blue')
        // pointMaterial.map = particlesTexture;

        //メッシュ化
        const particles = new THREE.Points(particlesGeometry, pointMaterial)
        scene.add(particles)

        //マウス操作
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const clock = new THREE.Clock();

        let req = null
        const animate = () => {
            req = requestAnimationFrame(animate)
            const elapsedTime = clock.getElapsedTime();

            for (let i=0;i<count;i++){
                const i3 = i * 3
                const x = particlesGeometry.attributes.position.array[i3 + 0]
                particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
            }
            particlesGeometry.attributes.position.needsUpdate = true

            controls.update();

            //レンダリング
            renderer.render(scene, camera);

        }

        animate();

        return () => {
            //要素の解放
            renderer.dispose()
            cancelAnimationFrame(req)
        }
    }, [])

    return (
        <div ref={refContainer} className={style.particle}/>
    )
}