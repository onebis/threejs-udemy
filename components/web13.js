import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {div} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

const Web13 = () => {
    const [renderer, setRenderer] = useState()
    const [camera, setCamera] = useState()
    const refContainer = useRef(null)
    let pointLight, controls;

    //UIデバッグ設定
    // const gui = new dat.GUI()


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

        //シーン
        const scene = new THREE.Scene();

        //カメラ
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        setCamera(camera)
        scene.add(camera)

        //背景用のテクスチャ
        const textureLoader = new THREE.TextureLoader()
        scene.background = textureLoader.load("images/scene-bg.jpg")

        //オブジェクトを作成
        const boxGeometory = new THREE.BoxGeometry(5, 5, 5, 10)
        const boxMaterial = new THREE.MeshNormalMaterial();
        const box = new THREE.Mesh(boxGeometory, boxMaterial)
        box.position.set(0, 0.5, -15)
        box.rotation.set(1, 1, 0)

        const torusGeometory = new THREE.TorusGeometry(8, 2, 16, 100)
        const torusMaterial = new THREE.MeshNormalMaterial()
        const torus = new THREE.Mesh(torusGeometory, torusMaterial)
        torus.position.set(0, 1, 10)

        scene.add(box, torus)

        let scrollParcent = 0
        document.body.onscroll = () => {
            scrollParcent = (document.documentElement.scrollTop /
                    (document.documentElement.scrollHeight - document.documentElement.clientHeight))
                * 100
        }

        //線形補間で滑らかに移動させる
        function lerp(x, y, a) {
            return (1 - a) * x + a * y
        }

        function scalePercent(start, end){
            return (scrollParcent - start) / (end - start)
        }

        //アニメーションを追加
        const animationScript = []
        animationScript.push({
            start: 0,
            end: 40,
            function() {
                camera.lookAt(box.position)
                camera.position.set(0, 1, 10)
                box.position.z = lerp(-15, 2, scalePercent(0, 40))
                torus.position.z = lerp(10, -20, scalePercent(0, 40))
            }
        })
        animationScript.push({
            start: 40,
            end: 60,
            function() {
                camera.lookAt(box.position)
                camera.position.set(0, 1, 10)
                box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60))
            }
        })
        animationScript.push({
            start: 60,
            end: 80,
            function() {
                camera.lookAt(box.position)
                camera.position.x = lerp(0,-15, scalePercent(60,80))
                camera.position.y = lerp(1,15, scalePercent(60,80))
                camera.position.z = lerp(10,25, scalePercent(60,80))
            }
        })
        animationScript.push({
            start: 80,
            end: 100,
            function() {
                camera.lookAt(box.position)
                box.rotation.x += 0.02
                box.rotation.y += 0.02
            }
        })


        function playScrollAnimation() {
            animationScript.forEach((animation) => {
                if (scrollParcent > animation.start && scrollParcent <= animation.end) {
                    animation.function()
                }
            })
        }


        //アニメーション
        const tick = () => {
            requestAnimationFrame(tick);
            playScrollAnimation()
            renderer.render(scene, camera);
        };

        tick();


    }, [])

    useEffect(() => {
        window.addEventListener('resize', onWindowResize, false)
    }, [renderer])

    return (
        <>
            <div ref={refContainer} className="canvas"/>
            <style jsx>{`
              .canvas {
                position: fixed;
                top: 0;
                left: 0;
              }
            `}</style>
        </>
    )

}

export default Web13