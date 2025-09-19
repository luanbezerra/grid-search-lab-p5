function uniforme(start, end) {
  let priorityQueue = [];
  let dist = Array(rows * cols).fill(Infinity)
  let directions = [
    { x: 0, y: -1, cost: 1 }, // cima
    { x: 1, y: 0, cost: 1 }, // direita
    { x: 0, y: 1, cost: 1 }, // baixo
    { x: -1, y: 0, cost: 1 }, // esquerda
  ];

  // Função para adicionar à fila de prioridade
  function addToQueue(position, path, cost) {
    priorityQueue.push({ position, path, cost });
    priorityQueue.sort((a, b) => a.cost - b.cost); // Ordena pela menor função f(n)
  }
  
  neighbours.push(start)
  addToQueue(start, [], 0); // Adiciona o nó inicial
  dist[start.y * cols + start.x] = 0;

  let interval = setInterval(() => {
    if (priorityQueue.length === 0) {
      clearInterval(interval);
      uniformeRunning = false;
      return;
    }

    let current = priorityQueue.shift(); // Pega o nó com menor custo
    let { position, path, cost } = current;

    uniformeVisited.push(position); // Usando uniformeVisited para exibir visitados

    if (position.x === end.x && position.y === end.y) {
      uniformePath = path.concat(position); // Usando uniformePath para exibir o caminho final
      clearInterval(interval);
      uniformeRunning = false;
      startMovingAgent(uniformePath); // Move o agente pelo caminho encontrado
      uniformeVisited = []
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
          grid[next.y][next.x] !== Infinity
      ) {
          if (!neighbours.some(n => n.x === next.x && n.y === next.y)) {
            neighbours.push(next);
          }
        
          let nextCost = cost + grid[next.y][next.x]; // Custo acumulado
          if (nextCost < dist[next.y * cols + next.x]){
            dist[next.y * cols + next.x] = nextCost
            addToQueue(next, path.concat(next), nextCost);
          }
      }
    }
  }, 50);
}
