'use strict'
//слушатель, который слушает события load(когда страница загрузиться будет запущена функция init)
window.addEventListener('load', init, false);

function init() {
    createScene();

    createLights();

    // createPlane();
    createSea();
    // createSky();

    //запускает цикл, который будет обновлять позиции объектов и визуализировать сцену на каждом кадре
    animation();
}

//Сцена, поле зрения, соотношение сторон, рядом с самолетом, вдали от самолета, визуализация, контейнер
var Sea, sea, camera, scene, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    //создание камеры
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane,
    );

    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    renderer = new THREE.WebGLRenderer({
        //разрешить отображение прозрачности или нет. Градиентный фон. (По умолчанию - false)
        alpha: true,
        //активация сглаживания
        antialias: true
    });

    //размер рендера во весь экран
    renderer.setSize(WIDTH, HEIGHT);

    renderer.shadowMap.enabled = true;

    container = document.getElementById("world");
    container.appendChild(renderer.domElement);

    //слушатель на изменение масштаба страницы, крч подстроиться должен, если пользователь меняет размер
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(150, 350, 350);

    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

Sea = function () {
    let geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    let mat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: .6,
        shading: THREE.FlatShading,
    });

    let mesh = new THREE.Mesh(geom, mat);

    mesh.receiveShadow = true;

    return mesh;
}


function createSea() {
    sea = new Sea();

    sea.position.y = -600;

    scene.add(sea);
}

function animation() {
    requestAnimationFrame(animation);

    sea.rotation.z += 1;

    renderer.render(scene, camera);
}


