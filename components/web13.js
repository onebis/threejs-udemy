import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {div} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import * as dat from "lil-gui"

const Web13 = () => {
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
        //canvas
        const canvas = document.querySelector("#webgl");

        //シーン
        const scene = new THREE.Scene();

        //サイズ
        const sizes = {
            width: innerWidth,
            height: innerHeight,
        };

        //カメラ
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        //レンダラー
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(window.devicePixelRatio);

        //アニメーション
        const tick = () => {
            requestAnimationFrame(tick);
            renderer.render(scene, camera);
        };

        tick();


    }, [])

    useEffect(() => {
        window.addEventListener('resize', onWindowResize, false)
    }, [renderer])

    return (
        <div ref={refContainer}/>
    )

}

export default Web13