const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight * 0.9);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 0);
scene.add(ambientLight, pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data
const planetsData = [
  { name: 'Mercury', radius: 0.4, distance: 6, speed: 0.02, color: 0xaaaaaa },
  { name: 'Venus', radius: 0.6, distance: 8, speed: 0.015, color: 0xffcc99 },
  { name: 'Earth', radius: 0.65, distance: 10, speed: 0.012, color: 0x3399ff },
  { name: 'Mars', radius: 0.5, distance: 12, speed: 0.01, color: 0xff3300 },
  { name: 'Jupiter', radius: 1.4, distance: 15, speed: 0.006, color: 0xffcc66 },
  { name: 'Saturn', radius: 1.2, distance: 18, speed: 0.004, color: 0xffcc99 },
  { name: 'Uranus', radius: 1.0, distance: 21, speed: 0.003, color: 0x66ffff },
  { name: 'Neptune', radius: 1.0, distance: 24, speed: 0.002, color: 0x3366ff },
];

const planets = [];
const angles = [];
const speeds = {};

// Create planets
planetsData.forEach((p, i) => {
  const geometry = new THREE.SphereGeometry(p.radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: p.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  planets.push({ mesh, distance: p.distance });
  angles.push(Math.random() * Math.PI * 2);
  speeds[p.name] = p.speed;

  // Create speed control sliders
  const controls = document.getElementById('controls');
  const label = document.createElement('label');
  label.textContent = `${p.name} Speed`;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = 0.001;
  input.max = 0.05;
  input.step = 0.001;
  input.value = p.speed;
  input.addEventListener('input', (e) => {
    speeds[p.name] = parseFloat(e.target.value);
  });
  controls.appendChild(label);
  controls.appendChild(input);
});

camera.position.z = 40;

let paused = false;
document.getElementById('pauseBtn').onclick = () => paused = true;
document.getElementById('resumeBtn').onclick = () => paused = false;

function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    planets.forEach((p, i) => {
      const name = planetsData[i].name;
      angles[i] += speeds[name];
      p.mesh.position.x = Math.cos(angles[i]) * p.distance;
      p.mesh.position.z = Math.sin(angles[i]) * p.distance;
    });
  }
  renderer.render(scene, camera);
}
animate();
