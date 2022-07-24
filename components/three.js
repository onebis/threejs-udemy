import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {div} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import style from '../styles/Style.module.css'

const Three = () => {
    const [renderer, setRenderer] = useState()
    const [camera, setCamera] = useState()
    const refContainer = useRef(null)
    let pointLight, controls;


    const onWindowResize = useCallback(()=>{
        if (renderer){
            //ブラウザのリサイズに対応させて、中心にくるようにする
            renderer.setSize(window.innerWidth, window.innerHeight)
            //カメラのアスペクト比を合わせ、横幅だけ伸びるなどをなくす
            camera.aspect = window.innerWidth / window.innerHeight
            //cameraに変更を加えた場合updateProjectionMatrix()を呼び出す必要がある
            camera.updateProjectionMatrix()
        }
    },[renderer])


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
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        //カメラの位置を設定
        camera.position.set(0, 0, 500)
        setCamera(camera)

        //ジオメトリ(骨組み)の作成
        const ballGeometry = new THREE.SphereGeometry(
            100,
            64,
            32
        )
        //テクスチャを設定
        let textures = new THREE.TextureLoader().load("earth.jpg")
        //マテリアル(材質)の作成
        const ballMaterial = new THREE.MeshPhysicalMaterial({map: textures})
        //メッシュ化
        const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
        //シーンへ追加
        scene.add(ballMesh)

        //平行光源を追加
        const directionalLight = new THREE.DirectionalLight(
            0xfffff,
            2
        )
        //光源の方向を設定
        directionalLight.position.set(1, 1, 1)
        //シーンに追加
        scene.add(directionalLight)

        pointLight = new THREE.PointLight(0xfffff, 1)
        pointLight.position.set(-200, -200, -200)
        scene.add(pointLight)

        //ポイント光源がどこにあるのか特定
        let pointLightHelper = new THREE.PointLightHelper(pointLight, 30)
        scene.add(pointLightHelper)

        //マウスコントロール設定
        controls = new OrbitControls(camera, renderer.domElement)



        let req = null
        const animate = () => {
            req = requestAnimationFrame(animate)

            //ポイント光源を急の周りを回らせる
            pointLight.position.set(
                200 * Math.sin(Date.now() / 500),
                200 * Math.sin(Date.now() / 1000),
                200 * Math.cos(Date.now() / 500),
            )

            //描写(この時点で描写できている)
            renderer.render(scene, camera)
        }

        animate()

        return () => {
            //要素の解放
            renderer.dispose()
            cancelAnimationFrame(req)
        }
    }, [])


    useEffect(()=> {
        window.addEventListener('resize', onWindowResize, false)
    },[renderer])

    return (
            <div ref={refContainer} className={style.main}/>
    )

}

export default Three