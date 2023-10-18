import React, { Component } from 'react';
import styled from 'styled-components';

const numRows = 20;
const numCols = 20;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${numCols}, 25px);
  grid-template-rows: repeat(${numRows}, 25px);
  background-color: #030303;
`;

const Cell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SnakeSegment = styled(Cell)`
  background-color: green;
  border: 1px solid wheat;
`;

const Food = styled(Cell)`
  background-color: red;
  display: flex;
  align-items: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-top: 3.5px;
  margin-left: 4px;
`;

const YellowBall = styled(Cell)`
  background-color: yellow;
  border-radius: 50%;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      snake: [{ row: 5, col: 5 }],
      food: { row: 10, col: 10 },
      yellowBall: null,
      direction: 'RIGHT',
      score: 0,
      gameStarted: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    this.gameInterval = setInterval(this.moveSnake, 200);
    this.spawnYellowBall(); // Start spawning yellow balls
  }

  componentWillUnmount() {
    clearInterval(this.gameInterval);
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    if (!this.state.gameStarted) {
      this.setState({ gameStarted: true });
      this.gameInterval = setInterval(this.moveSnake, 200);
    }

    switch (event.key) {
      case 'ArrowUp':
        this.setState({ direction: 'UP' });
        break;
      case 'ArrowDown':
        this.setState({ direction: 'DOWN' });
        break;
      case 'ArrowLeft':
        this.setState({ direction: 'LEFT' });
        break;
      case 'ArrowRight':
        this.setState({ direction: 'RIGHT' });
        break;
      default:
        break;
    }
  };

  moveSnake = () => {
    const { snake, direction, food, score, yellowBall } = this.state;
    const head = Object.assign({}, snake[0]);

    switch (direction) {
      case 'UP':
        head.row -= 1;
        break;
      case 'DOWN':
        head.row += 1;
        break;
      case 'LEFT':
        head.col -= 1;
        break;
      case 'RIGHT':
        head.col += 1;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake];

    if (this.isCollisionWithFood(head, food)) {
      this.generateFood();
      this.setState({ score: score + 1 });
    } else if (this.isCollisionWithFood(head, yellowBall)) {
      this.setState({ yellowBall: null, score: score + 2 }); // +2 for yellow ball
      this.scheduleYellowBallSpawn(); // Schedule the next yellow ball spawn
    } else {
      newSnake.pop();
    }

    this.setState({ snake: newSnake });
  };

  isCollisionWithFood(head, food) {
    return food && head.row === food.row && head.col === food.col;
  }

  generateFood = () => {
    const newFood = {
      row: Math.floor(Math.random() * numRows),
      col: Math.floor(Math.random() * numCols),
    };
    this.setState({ food: newFood });
  };

  spawnYellowBall = () => {
    this.scheduleYellowBallSpawn();
  };

  scheduleYellowBallSpawn = () => {
    const delay = Math.floor(Math.random() * 16) * 2000 + 5000; // Random delay between 5 and 20 seconds
    setTimeout(() => {
      const yellowBall = {
        row: Math.floor(Math.random() * numRows),
        col: Math.floor(Math.random() * numCols),
      };
      this.setState({ yellowBall });
      setTimeout(() => {
        this.setState({ yellowBall: null });
        this.scheduleYellowBallSpawn();
      }, 6000); // Yellow ball disappears after 3 seconds
    }, delay);
  };

  render() {
    const { snake, food, yellowBall, score, gameStarted } = this.state;

    const grid = [];
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const isSnakeSegment = snake.some(
          (segment) => segment.row === i && segment.col === j
        );
        const isFood = this.isCollisionWithFood({ row: i, col: j }, food);
        const isYellowBall = this.isCollisionWithFood({ row: i, col: j }, yellowBall);

        const CellComponent = isSnakeSegment ? SnakeSegment : isFood ? Food : isYellowBall ? YellowBall : Cell;

        grid.push(<CellComponent key={`${i}-${j}`} />);
      }
    }

    return (
      <div>
        {gameStarted ? (
          <div>
            <GameGrid>{grid}</GameGrid>
            <div>Score: {score}</div>
          </div>
        ) : (
          <div>Press an arrow key to start the game.</div>
        )}
      </div>
    );
  }
}

export default App;
