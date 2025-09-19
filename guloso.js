// HEURÍSTICA: MANHATTAN

function guloso(start, end) {
  let priorityQueue = [];
  let visited = new Set();
  let directions = [
    { x: 0, y: -1 }, // cima
    { x: 1, y: 0 }, // direita
    { x: 0, y: 1 }, // baixo
    { x: -1, y: 0 }, // esquerda
  ];

  // Função heurística: Distância de Manhattan
  function heuristic(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  // Função para adicionar à fila de prioridade
  function addToQueue(position, path) {
    let h = heuristic(position, end);
    priorityQueue.push({ position, path, heuristic: h });
    priorityQueue.sort((a, b) => a.heuristic - b.heuristic); // Ordena pela menor heurística
  }
  
  neighbours.push(start)
  addToQueue(start, []); // Adiciona o nó inicial
  visited.add(`${start.x},${start.y}`);

  let interval = setInterval(() => {
    if (priorityQueue.length === 0) {
      clearInterval(interval);
      gulosoRunning = false;
      return;
    }

    let current = priorityQueue.shift(); // Pega o nó com menor heurística
    let { position, path } = current;

    gulosoVisited.push(position); // Usando gulosoVisited para exibir visitados

    if (position.x === end.x && position.y === end.y) {
      gulosoPath = path.concat(position); // Usando gulosoPath para exibir o caminho final
      clearInterval(interval);
      gulosoRunning = false;
      startMovingAgent(gulosoPath);
      gulosoVisited = []
      neighbours = []
      return;
    }

    for (let dir of directions) {
      let next = { x: position.x + dir.x, y: position.y + dir.y };

      if (
        next.x >= 0 &&
        next.x < cols &&
        next.y >= 0 &&
        next.y < rows &&
        grid[next.y][next.x] !== Infinity &&
        !visited.has(`${next.x},${next.y}`)
      ) {
        neighbours.push(next)
        addToQueue(next, path.concat(position));
        visited.add(`${next.x},${next.y}`);
      }
    }
  }, 50);
}

// HEURÍSTICA: EUCLIDIANA

// function guloso(start, end) {
//   let priorityQueue = [];
//   let visited = new Set();
//   let directions = [
//     { x: 0, y: -1 }, // cima
//     { x: 1, y: 0 }, // direita
//     { x: 0, y: 1 }, // baixo
//     { x: -1, y: 0 }, // esquerda
//   ];

//   // Função heurística: Distância Euclidiana
//   function heuristic(pos1, pos2) {
//     return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
//   }

//   // Função para adicionar à fila de prioridade
//   function addToQueue(position, path) {
//     let h = heuristic(position, end);
//     priorityQueue.push({ position, path, heuristic: h });
//     priorityQueue.sort((a, b) => a.heuristic - b.heuristic); // Ordena pela menor heurística
//   }

//   addToQueue(start, []); // Adiciona o nó inicial
//   visited.add(`${start.x},${start.y}`);

//   let interval = setInterval(() => {
//     if (priorityQueue.length === 0) {
//       clearInterval(interval);
//       gulosoRunning = false;
//       return;
//     }

//     let current = priorityQueue.shift(); // Pega o nó com menor heurística
//     let { position, path } = current;

//     gulosoVisited.push(position); // Usando gulosoVisited para exibir visitados

//     if (position.x === end.x && position.y === end.y) {
//       gulosoPath = path.concat(position); // Usando gulosoPath para exibir o caminho final
//       clearInterval(interval);
//       gulosoRunning = false;
//       startMovingAgent(gulosoPath);
//       return;
//     }

//     for (let dir of directions) {
//       let next = { x: position.x + dir.x, y: position.y + dir.y };

//       if (
//         next.x >= 0 &&
//         next.x < cols &&
//         next.y >= 0 &&
//         next.y < rows &&
//         grid[next.y][next.x] !== Infinity &&
//         !visited.has(`${next.x},${next.y}`)
//       ) {
//         addToQueue(next, path.concat(position));
//         visited.add(`${next.x},${next.y}`);
//       }
//     }
//   }, 50);
// }