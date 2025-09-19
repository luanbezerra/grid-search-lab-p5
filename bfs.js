function bfs(start, end) {
  let queue = [];
  let visited = new Set();
  let directions = [
    { x: 0, y: -1 }, // cima
    { x: 1, y: 0 }, // direita
    { x: 0, y: 1 }, // baixo
    { x: -1, y: 0 }, // esquerda
  ];

  queue.push({ position: start, path: [] });
  visited.add(`${start.x},${start.y}`);

  let interval = setInterval(() => {
    if (queue.length === 0) {
      clearInterval(interval);
      bfsRunning = false;
      return;
    }

    let current = queue.shift();
    let { position, path } = current;

    bfsVisited.push(position);

    if (position.x === end.x && position.y === end.y) {
      bfsPath = path.concat(position);
      clearInterval(interval);
      bfsRunning = false;
      startMovingAgent(bfsPath);
      bfsVisited = [];
      neighbours = [];
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
        queue.push({ position: next, path: path.concat(position) });
        visited.add(`${next.x},${next.y}`);
      }
    }
  }, 50);
}
