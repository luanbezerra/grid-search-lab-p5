function dfs(start, end) {
  let stack = [];
  let visited = new Set();
  let directions = [
    { x: 0, y: -1 }, // cima
    { x: 1, y: 0 }, // direita
    { x: 0, y: 1 }, // baixo
    { x: -1, y: 0 }, // esquerda
  ];

  stack.push({ position: start, path: [] });
  visited.add(`${start.x},${start.y}`);
  neighbours.push(start)
  
  let interval = setInterval(() => {
    if (stack.length === 0) {
      clearInterval(interval);
      dfsRunning = false;
      return;
    }

    let current = stack.pop();
    let { position, path } = current;

    visitedDFS.push(position);

    if (position.x === end.x && position.y === end.y) {
      dfsPath = path.concat(position);
      clearInterval(interval);
      dfsRunning = false;
      startMovingAgent(dfsPath);
      visitedDFS = [];
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
        stack.push({ position: next, path: path.concat(position) });
        visited.add(`${next.x},${next.y}`);
      }
    }
  }, 50);
}
