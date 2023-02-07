import { useResizeObserver } from '@vueuse/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { onMounted, onUnmounted, type Ref } from 'vue';

export function useThree(ele: Ref<HTMLElement | null>) {
  let container: HTMLElement;
  let renderer: THREE.WebGLRenderer;
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let renderer3D: CSS3DRenderer;
  let orbitControls: OrbitControls;

  let req: number;

  onMounted(() => {
    init();
    initHelper();
    initLight();
    initController();
    initCSS3DRenderer();
    render();

    addBoard();
  });

  onUnmounted(() => {
    dispose();
  });

  /**
   * 初始化
   */
  function init() {
    container = ele.value!;

    const { clientHeight, clientWidth } = container;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    // 镜头
    camera = new THREE.PerspectiveCamera(60, clientWidth / clientHeight, 0.01, 1000);
    camera.position.set(10, 10, 10);

    scene = new THREE.Scene();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(clientWidth, clientHeight);

    container.appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(20000, 800, 0xffffff, 0xffffff);
    const material = grid.material as THREE.Material;
    material.opacity = 0.1;
    material.transparent = true;
    material.depthWrite = false;
    scene.add(grid);

    useResizeObserver(container, entries => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer3D.setSize(width, height);
    });
  }

  /**
   * 渲染辅助线
   */
  function initHelper() {
    const axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);
    // const cameraHelper = new THREE.CameraHelper(camera);
    // scene.add(cameraHelper);
  }
  /**
   *  添加灯光
   */
  function initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(0.5, 0, 0.866); // ~60º
    scene.add(directionalLight);
  }

  /**
   * 初始化控制器
   */
  function initController() {
    orbitControls = new OrbitControls(camera, renderer.domElement);
  }

  function initCSS3DRenderer() {
    renderer3D = new CSS3DRenderer();
    renderer3D.setSize(container.clientWidth, container.clientHeight);
    renderer3D.domElement.style.position = 'absolute';
    renderer3D.domElement.style.top = '0px';
    renderer3D.domElement.classList.add('css3d-renderer');
    renderer3D.domElement.style.pointerEvents = 'none';

    container.appendChild(renderer3D.domElement);
  }

  /**
   * render scene
   */
  function render() {
    req = requestAnimationFrame(render);

    renderer.render(scene, camera);
    renderer3D.render(scene, camera);
  }

  function addBoard() {
    const geometry = new THREE.BoxGeometry(1, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x999999 });
    const cube = new THREE.Mesh(geometry, material);
    cube.scale.set(0.5, 0.5, 0.5);

    const x = 0;
    const y = 0;
    const z = 0;
    cube.position.set(x, y, z);
    const el = document.querySelector(`.board-info`);
    if (el) {
      const boardInfo = new CSS3DObject(el as HTMLElement);
      boardInfo.position.set(x, y, z);
      boardInfo.scale.set(0.05, 0.05, 0.05);
      boardInfo.rotateY(Math.PI / 2);
      scene.add(boardInfo);
      scene.add(cube);
    }
  }

  /**
   * 销毁实例
   */
  function dispose() {
    window.cancelAnimationFrame(req);

    scene.clear();
    renderer.dispose?.();

    container.removeChild(renderer.domElement);
  }
}

export type UseThreeType = ReturnType<typeof useThree>;
