import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const BlockSize = 25;
const Rows = 20;
const Cols = 20;

const Canvas = styled.canvas`
  border: 1px solid #000;
`;

const MyComponent = () => {
  const boardRef = useRef(null);
  const [snake, setSnake] = useState([{ x: BlockSize * 5, y: BlockSize * 5 }]);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [score, setScore] = useState(0);
  const [foodPosition, setFoodPosition] = useState(generateRandomPosition());

  function generateRandomPosition() {
    const foodX = Math.floor(Math.random() * Cols) * BlockSize;
    const foodY = Math.floor(Math.random() * Rows) * BlockSize;
    return { x: foodX, y: foodY };
  }

  function isCollisionWithFood(newSnakeHead, foodPos) {
    return newSnakeHead.x === foodPos.x && newSnakeHead.y === foodPos.y;
  }

  useEffect(() => {
    const board = boardRef.current;
    const context = board.getContext("2d");

    board.height = Rows * BlockSize;
    board.width = Cols * BlockSize;

    // Drawing
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Game Loop
    function gameLoop() {
      const newSnake = [...snake];
      const newSnakeHead = {
        x: snake[0].x + velocityX * BlockSize,
        y: snake[0].y + velocityY * BlockSize,
      };
      newSnake.unshift(newSnakeHead);

      // Check for collisions with food
      if (isCollisionWithFood(newSnakeHead, foodPosition)) {
        // Increase the score
        setScore(score + 1);

        // Generate a new position for the food
        const newFoodPosition = generateRandomPosition();
        setFoodPosition(newFoodPosition);
      } else {
        newSnake.pop();
      }

      // Check for collisions with the boundaries
      if (
        newSnakeHead.x >= 0 &&
        newSnakeHead.y >= 0 &&
        newSnakeHead.x < board.width &&
        newSnakeHead.y < board.height
      ) {
        setSnake(newSnake);

        context.clearRect(0, 0, board.width, board.height);

        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);

        context.fillStyle = "lime";
        snake.forEach((segment) => {
          context.fillRect(segment.x, segment.y, BlockSize, BlockSize);
        });

        context.fillStyle = "red";
        context.fillRect(foodPosition.x, foodPosition.y, BlockSize, BlockSize);
      }

      requestAnimationFrame(gameLoop);
    }

    // Arrow key handlers
    function handleKeyDown(e) {
      if (e.code === "ArrowUp" && velocityY !== 1) {
        setVelocityX(0);
        setVelocityY(-1);
      } else if (e.code === "ArrowDown" && velocityY !== -1) {
        setVelocityX(0);
        setVelocityY(1);
      } else if (e.code === "ArrowLeft" && velocityX !== 1) {
        setVelocityX(-1);
        setVelocityY(0);
      } else if (e.code === "ArrowRight" && velocityX !== -1) {
        setVelocityX(1);
        setVelocityY(0);
      }
    }

    // Attach arrow key event listeners
    document.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(gameLoop);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [snake, velocityX, velocityY, score, foodPosition]);

  return (
    <div>
      <div>Score: {score}</div>
      <Canvas id="board" ref={boardRef}></Canvas>
    </div>
  );
};

export default MyComponent;
