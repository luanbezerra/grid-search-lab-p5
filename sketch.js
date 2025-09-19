let grid = [];
let rows = 20;
let cols = 20;
let cellSize = 30;

let agent, food;

let bfsRunning = false;
let dfsRunning = false;
let uniformeRunning = false;
let gulosoRunning = false;
let astarRunning = false;

let moveAgentActive = false;
let moveInterval;

let bfsPath = [];
let dfsPath = [];
let uniformePath = [];
let gulosoPath = [];
let astarPath = [];

let bfsVisited = [];
let visitedDFS = [];
let uniformeVisited = [];
let gulosoVisited = [];
let astarVisited = [];

let neighbours = [];

// let colors = {
//   bfs: { visited: [0,0,255, 30], path: [0, 0, 255] }, // Azul claro e amarelo
//   dfs: { visited: [255, 182, 193, 150], path: [255, 56, 152] }, // Rosa claro e ciano
//   uniforme: { visited: [144, 238, 144, 150], path: [34, 139, 34] }, // Verde claro e verde escuro
//   guloso: { visited: [255, 255, 150, 180], path: [255, 223, 0] }, // Amarelo claro e amarelo forte
//   astar: { visited: [128, 0, 128, 80], path: [75, 0, 130] }, // Roxo claro e índigo
// };

let colors = {
  expansion: [0,0,255,60],
  neighbours: [0,0,255,160],
  path: {low: [194,230,153], medium: [120,198,121], high: [35,132,67]},
  expStroke: [],
  neiStroke: []
};

let currentAlgorithm = ""; // Rastreamento do algoritmo em execução

function setup() {
  createCanvas(cols * cellSize, rows * cellSize + 60); // Adiciona espaço extra abaixo do grid
  generateGrid();
  placeAgentAndFood();
}

function draw() {
  background(255);
  drawGrid();
  drawVisited();
  drawPath();
  
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  
  text(
    currentAlgorithm ? "Algoritmo: " + currentAlgorithm.toUpperCase() : "Pressione 1-5 para selecionar um algoritmo",
    width / 2,
    rows * cellSize + 20 // Posiciona logo abaixo do grid
  );

  textSize(16);
  text(
    "1: BFS  |  2: DFS  |  3: Custo Uniforme  |  4: Guloso  |  5: A*",
    width / 2,
    rows * cellSize + 40 // Linha extra para legenda
  );
}


function keyPressed() {
  if (key === '1') {
    resetSearch();
    bfsRunning = true;
    currentAlgorithm = "bfs";
    bfs(agent, food);
  } else if (key === '2') {
    resetSearch();
    dfsRunning = true;
    currentAlgorithm = "dfs";
    dfs(agent, food);
  } else if (key === '3') {
    resetSearch();
    uniformeRunning = true;
    currentAlgorithm = "uniforme";
    uniforme(agent, food);
  } else if (key === '4') {
    resetSearch();
    gulosoRunning = true;
    currentAlgorithm = "guloso";
    guloso(agent, food);
  } else if (key === '5') {
    resetSearch();
    astarRunning = true;
    currentAlgorithm = "astar";
    astar(agent, food);
  }
}

function resetSearch() {
  bfsPath = [];
  dfsPath = [];
  uniformePath = [];
  gulosoPath = [];
  astarPath = [];

  bfsVisited = [];
  visitedDFS = [];
  uniformeVisited = [];
  gulosoVisited = [];
  astarVisited = [];
  
  neighbours = []

  let bfsRunning = false;
  let dfsRunning = false;
  let uniformeRunning = false;
  let gulosoRunning = false;
  let astarRunning = false;
  
  moveAgentActive = false;
  currentAlgorithm = "";

  if (moveInterval) {
    clearInterval(moveInterval);
  }
}

// function generateGrid() {
//   grid = [];
//   for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//       let type = random([1, 3, 5, Infinity]);
//       row.push(type);
//     }
//     grid.push(row);
//   }
// }

function generateGrid() {
  grid = [];
  let noiseScale = 0.5; // Ajuste para controlar a granularidade

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let noiseValue = noise(j * noiseScale, i * noiseScale);
      
      if (noiseValue < 0.39) row.push(1); // Custo Baixo
      else if (noiseValue < 0.48) row.push(3); // Custo Médio
      else if (noiseValue < 0.57) row.push(5); // Custo Alto
      else row.push(Infinity); // Obstáculo
    }
    grid.push(row);
  }
}


function placeAgentAndFood() {
  let agentPlaced = false;
  let foodPlaced = false;

  while (!agentPlaced) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    if (grid[y][x] !== Infinity) {
      agent = { x, y };
      agentPlaced = true;
    }
  }

  while (!foodPlaced) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    if (grid[y][x] !== Infinity && (x !== agent.x || y !== agent.y)) {
      food = { x, y };
      foodPlaced = true;
    }
  }
}

function drawGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * cellSize;
      let y = i * cellSize;

      if (grid[i][j] === Infinity) fill(0); // Obstáculo
      else if (grid[i][j] === 1) fill(255,237,160); // Custo Baixo
      else if (grid[i][j] === 3) fill(254,178,76); // Custo Médio
      else if (grid[i][j] === 5) fill(240,59,32); // Custo Alto
      rect(x, y, cellSize, cellSize);
    }
  }

  // agente
  printAgent();

  // comida
  printFood();
}

function printAgent() {
  fill(0, 255, 0);
  ellipse(agent.x * cellSize + cellSize / 2, agent.y * cellSize + cellSize / 2, cellSize / 2);
}

function printFood() {
  fill(255, 100, 255);
  ellipse(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 2);
}

function drawVisited() {
  let mode = "";
  stroke(0); // Mantém a stroke preta padrão do grid
  strokeWeight(1);
  
  if (currentAlgorithm === "bfs") {
    mode = "BFS";
    for (let nei of neighbours) {
      if (bfsVisited.includes(nei)) {
        fill(...colors.expansion);
        stroke(0, 255, 0); // Borda verde para nós expandidos
        strokeWeight(2);
      } else {
        fill(colors.neighbours);
        stroke(255); // Borda branca para a fronteira
        strokeWeight(2);
      }
      rect(nei.x * cellSize, nei.y * cellSize, cellSize, cellSize);
      stroke(0); // Restaura a stroke preta
      strokeWeight(1);
    }
  } else if (currentAlgorithm === "dfs") {
    mode = "DFS";
    for (let nei of neighbours) {
      if (visitedDFS.includes(nei)) {
        fill(...colors.expansion);
        stroke(0, 255, 0);
        strokeWeight(2);
      } else {
        fill(colors.neighbours);
        stroke(255);
        strokeWeight(2);
      }
      rect(nei.x * cellSize, nei.y * cellSize, cellSize, cellSize);
      stroke(0);
      strokeWeight(1);
    }
  } else if (currentAlgorithm === "uniforme") {
    mode = "Custo Uniforme";
    for (let nei of neighbours) {
      if (uniformeVisited.includes(nei)) {
        fill(...colors.expansion);
        stroke(0, 255, 0);
        strokeWeight(2);
      } else {
        fill(colors.neighbours);
        stroke(255);
        strokeWeight(2);
      }
      rect(nei.x * cellSize, nei.y * cellSize, cellSize, cellSize);
      stroke(0);
      strokeWeight(1);
    }
  } else if (currentAlgorithm === "guloso") {
    mode = "Guloso";
    for (let nei of neighbours) {
      if (gulosoVisited.includes(nei)) {
        fill(...colors.expansion);
        stroke(0, 255, 0);
        strokeWeight(2);
      } else {
        fill(colors.neighbours);
        stroke(255);
        strokeWeight(2);
      }
      rect(nei.x * cellSize, nei.y * cellSize, cellSize, cellSize);
      stroke(0);
      strokeWeight(1);
    }
  } else if (currentAlgorithm === "astar") {
    mode = "A*";
    for (let nei of neighbours) {
      if (astarVisited.includes(nei)) {
        fill(...colors.expansion);
        stroke(0, 255, 0);
        strokeWeight(2);
      } else {
        fill(colors.neighbours);
        stroke(255);
        strokeWeight(2);
      }
      rect(nei.x * cellSize, nei.y * cellSize, cellSize, cellSize);
      stroke(0);
      strokeWeight(1);
    }
  }
  fill(0, 255, 255);
}

function drawPath() {
  stroke(0);
  strokeWeight(1);
  if (currentAlgorithm === "bfs" && bfsPath.length > 0) {
    for (let pos of bfsPath) {
      stroke(255)
      strokeWeight(2)
      if(grid[pos.y][pos.x] == 1) {
        fill(...colors.path.low);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 3) {
        fill(...colors.path.medium);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 5) {
        fill(...colors.path.high);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      }
    }
  } else if (currentAlgorithm === "dfs" && dfsPath.length > 0) {
    for (let pos of dfsPath) {
      stroke(255)
      strokeWeight(2)
      if(grid[pos.y][pos.x] == 1) {
        fill(...colors.path.low);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 3) {
        fill(...colors.path.medium);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 5) {
        fill(...colors.path.high);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      }
    }
  } else if (currentAlgorithm === "uniforme" && uniformePath.length > 0) {
    for (let pos of uniformePath) {
      stroke(255)
      strokeWeight(2)
      if(grid[pos.y][pos.x] == 1) {
        fill(...colors.path.low);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 3) {
        fill(...colors.path.medium);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 5) {
        fill(...colors.path.high);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      }
    }
  } else if (currentAlgorithm === "guloso" && gulosoPath.length > 0) {
    for (let pos of gulosoPath) {
      stroke(255)
      strokeWeight(2)
      if(grid[pos.y][pos.x] == 1) {
        fill(...colors.path.low);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 3) {
        fill(...colors.path.medium);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 5) {
        fill(...colors.path.high);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      }
    }
  } else if (currentAlgorithm === "astar" && astarPath.length > 0) {
    for (let pos of astarPath) {
      stroke(255)
      strokeWeight(2)
      if(grid[pos.y][pos.x] == 1) {
        fill(...colors.path.low);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 3) {
        fill(...colors.path.medium);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      } else if (grid[pos.y][pos.x] == 5) {
        fill(...colors.path.high);
        rect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
      }
    }
  }
  stroke(0);
  strokeWeight(1);
  printAgent();
  printFood();
}

function startMovingAgent(path) {
  function moveStep() {
    let speed
    if (path.length > 0) {
      let next = path.shift();
      agent.x = next.x;
      agent.y = next.y;
      if(path.length == 0){
        moveAgentActive = false;
        placeFoodRandomly();
        resetSearch();
      }
      else{
        speed = grid[agent.y][agent.x] * 200; // Atualiza a velocidade
        moveInterval = setTimeout(moveStep, speed); // Chama a função novamente com a nova velocidade
      }
    }
  }

  moveStep(); // Inicia o movimento
}

function placeFoodRandomly() {
  let foodPlaced = false;
  while (!foodPlaced) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    if (grid[y][x] !== Infinity && (x !== agent.x || y !== agent.y)) {
      food = { x, y };
      foodPlaced = true;
    }
  }
}
