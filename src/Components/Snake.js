import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const BlockSize = 25;
const Rows = 20;
const Cols = 20;

const SnakeX = BlockSize * 5;
const SnakeY = BlockSize * 5;

const Canvas = styled.canvas`
  border: 1px solid #000;
`;

const MyComponent = () => {
  const boardRef = useRef(null);
  const [foodX, setFoodX] = useState(BlockSize * 10);
  const [foodY, setFoodY] = useState(BlockSize * 10);

  useEffect(() => {
    const board = boardRef.current;
    const context = board.getContext("2d");

    board.height = Rows * BlockSize;
    board.width = Cols * BlockSize;

    // Drawing
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Update function
    function update() {
      context.clearRect(0, 0, board.width, board.height);

      context.fillStyle = "black";
      context.fillRect(0, 0, board.width, board.height);

      context.fillStyle = "lime";
      context.fillRect(SnakeX, SnakeY, BlockSize, BlockSize);

      context.fillStyle = "red";
      context.fillRect(foodX, foodY, BlockSize, BlockSize);
    }

    // PlaceFood function
    function placeFood() {
      const newFoodX = Math.floor(Math.random() * Cols) * BlockSize;
      const newFoodY = Math.floor(Math.random() * Rows) * BlockSize;
      setFoodX(newFoodX);
      setFoodY(newFoodY);
    }

    placeFood();
    update();
  }, [foodX, foodY]);

  return <Canvas id="board" ref={boardRef}></Canvas>;
};

export default MyComponent;
