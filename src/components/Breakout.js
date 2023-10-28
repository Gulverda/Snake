import React, { Component } from 'react';
import styled from 'styled-components';

const GameCanvas = styled.canvas`
  background-color: #fff;
`;

const Ball = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: blue;
  position: absolute;
  transition: transform 0.1s;
`;

const Paddle = styled.div`
  width: 80px;
  height: 10px;
  background-color: #333;
  position: absolute;
`;

class Breakout extends Component {
  constructor() {
    super();
    this.state = {
      ballX: 50,
      ballY: 50,
      ballSpeedX: 5,
      ballSpeedY: 5,
      paddleX: 150,
    };
  }

  componentDidMount() {
    this.gameLoop = setInterval(this.updateGame, 1000 / 60);
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    clearInterval(this.gameLoop);
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  updateGame = () => {
    this.moveBall();
  }

  moveBall() {
    const { ballX, ballY, ballSpeedX, ballSpeedY } = this.state;

    const newBallX = ballX + ballSpeedX;
    const newBallY = ballY + ballSpeedY;
    this.setState({ ballX: newBallX, ballY: newBallY });
  }

  handleKeyPress = (event) => {
    if (event.key === 'ArrowLeft') {
      this.setState({ paddleX: this.state.paddleX - 10 });
    } else if (event.key === 'ArrowRight') {
      this.setState({ paddleX: this.state.paddleX + 10 });
    }
  }

  render() {
    const { ballX, ballY, paddleX } = this.state;

    return (
      <GameCanvas width={300} height={400}>
        <Ball style={{ left: ballX, top: ballY }}></Ball>
        <Paddle style={{ left: paddleX, bottom: 0 }}></Paddle>
      </GameCanvas>
    );
  }
}

export default Breakout;
