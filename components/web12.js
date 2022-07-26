import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {div} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import * as dat from "lil-gui"

const Web12 = () => {
    const [renderer, setRenderer] = useState()
    const [camera, setCamera] = useState()
    const refContainer = useRef(null)
    let pointLight, controls;

    //UIデバッグ設定
    const gui = new dat.GUI()


    const onWindowResize = useCallback(() => {
        if (renderer) {
            //ブラウザのリサイズに対応させて、中心にくるようにする
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(window.devicePixelRatio)
            //カメラのアスペクト比を合わせ、横幅だけ伸びるなどをなくす
            camera.aspect = window.innerWidth / window.innerHeight
            //cameraに変更を加えた場合updateProjectionMatrix()を呼び出す必要がある
            camera.updateProjectionMatrix()
        }
    }, [renderer])


    useEffect(() => {
        //useRefを使用し現在のノードを取得
        const container = refContainer.current
        //レンダラー作成
        const renderer = new THREE.WebGLRenderer({alpha: true})

        //サイズを設定
        renderer.setSize(window.innerWidth, window.innerHeight)
        //画面の大きさに合わせて、ピクセルの比率を合わせる
        renderer.setPixelRatio(window.devicePixelRatio)
        //子要素へ追加
        container.appendChild(renderer.domElement)
        setRenderer(renderer)

        //シーン作成
        const scene = new THREE.Scene()
        //カメラ作成
        const camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        )
        //カメラの位置を設定
        camera.position.z = 6
        setCamera(camera)
        scene.add(camera)

        //マテリアル(質感)
        const material = new THREE.MeshPhysicalMaterial({
            color: "#3c94d7",
            metalness: 0.865,
            roughness: 0.373,
            flatShading: true,
        })

        gui.addColor(material, "color")
        gui.add(material, "metalness").min(0).max().step(0.001)
        gui.add(material, "roughness").min(0).max().step(0.001)

        //メッシュ(ジオメトリにマテリアルをメッシュ化)
        const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
        const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material)
        const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)
        const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material)

        //回転用に配置する
        mesh1.position.set(2, 0, 0)
        mesh2.position.set(-1, 0, 0)
        mesh3.position.set(2, 0, -6)
        mesh4.position.set(5, 0, 3)
        scene.add(mesh1, mesh2, mesh3, mesh4)

        const meshes = [mesh1, mesh2, mesh3, mesh4]


        //パーティクルを追加
        const particlesGeometory = new THREE.BufferGeometry()
        const particlesCount = 700
        const positionArray = new Float32Array(particlesCount * 3)
        for (let i = 0; i < particlesCount; i++) {
            positionArray[i] = (Math.random() - 0.5) * 10
        }
        particlesGeometory.setAttribute("position", new THREE.BufferAttribute(positionArray, 3))
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.025,
            color: "#ffffff"
        })
        const particles = new THREE.Points(particlesGeometory, particlesMaterial)
        scene.add(particles)

        //ライトを追加
        const directionalLight = new THREE.DirectionalLight("#ffffff", 4)
        directionalLight.position.set(0.5, 1, 0)
        scene.add(directionalLight)

        //マウスコントロール設定
        // controls = new OrbitControls(camera, renderer.domElement)

        //ホイール
        let speed = 0
        let rotaion = 0
        window.addEventListener("wheel", (e) => {
            speed += e.deltaY * 0.002
        })

        const rot = () => {
            speed *= 0.93
            rotaion += speed
            //ジオメトリ全体を回転させる
            mesh1.position.x = 2 + 3.8 * Math.cos(rotaion)
            mesh1.position.z = -3 + 3.8 * Math.sin(rotaion)

            mesh2.position.x = 2 + 3.8 * Math.cos(rotaion + Math.PI / 2)
            mesh2.position.z = -3 + 3.8 * Math.sin(rotaion + Math.PI / 2)

            mesh3.position.x = 2 + 3.8 * Math.cos(rotaion + Math.PI)
            mesh3.position.z = -3 + 3.8 * Math.sin(rotaion + Math.PI)

            mesh4.position.x = 2 + 3.8 * Math.cos(rotaion + 3 * (Math.PI / 2))
            mesh4.position.z = -3 + 3.8 * Math.sin(rotaion + 3 * (Math.PI / 2))

            requestAnimationFrame(rot)
        }
        rot()

        //カーソルの位置を取得
        const cursor = {}
        cursor.x = 0
        cursor.y = 0

        window.addEventListener("mousemove", (e) => {
            cursor.x = e.clientX / window.innerWidth - 0.5;
            cursor.y = e.clientY / window.innerHeight - 0.5;
        })

        const clock = new THREE.Clock()
        let req = null
        const animate = () => {
            req = requestAnimationFrame(animate)

            //描写(この時点で描写できている)
            renderer.render(scene, camera)

            let getDeltaTime = clock.getDelta()
            // console.log(getDeltaTime)

            //meshを回転させる
            for (const mesh of meshes) {
                mesh.rotation.x += 0.1 * getDeltaTime
                mesh.rotation.y += 0.12 * getDeltaTime
            }

            // カメラ制御
            camera.position.x += cursor.x * getDeltaTime * 2
            camera.position.y += -cursor.y * getDeltaTime * 2
        }
        animate()

        return () => {
            //要素の解放
            renderer.dispose()
            cancelAnimationFrame(req)
        }

    }, [])

    useEffect(() => {
        window.addEventListener('resize', onWindowResize, false)
    }, [renderer])

    return (
        <div ref={refContainer}/>
    )

}

export default Web12