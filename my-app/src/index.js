//Se importan las librerías
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Se define la función Square que regresa un boton, toma un parametro props
function Square(props) {
  return (
    //Se define la forma del boton, su clase y su acción por click
    <button 
      className="square" 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

//Se crea la clase componente de React llamada Board
class Board extends React.Component {
  //Se crea el método renderSquare que toma un parámetro i que definirá el índice del arreglo squares y su value.
  renderSquare(i) {
    //Retorna un Square con value dependiendo de su indice dado.
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  //Se crea el método render que muestra en pantalla los Square con su indice unico
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

//Se crea la clase componente de React PADRE llamada Game que controlará el juego.
class Game extends React.Component {
  //Se crea el constructor tomando como parámetro props
  constructor(props) {
    super(props); //En todas las subclases de JS se debe poner super(props)
    this.state = { //Se crea el estado del objeto con un historial, stepNumber y un dato bool para saber si sigue la X en el juego
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  //Se crea la función handleClick que creará un historial y hará el cambio de X => O con forme se haga un click en un boton.
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    //Función que detiene el proceso si se gana el juego o se llena el arreglo de squares
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    //Si el estado del objeto en el arreglo es igual a X se cambia, sino es O
    squares[i] = this.state.xIsNext ? "X" : "O";

    //Se cambia el estado del historial usando inmutabilidad de datos, el stepNumber y xIsNext
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  //Se crea el método jumpTo que mandará al jugador a el movimiento deseado
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //Se muestra en pantalla el historial generado en cada jugada, creando una lista con botones para regresar si se desea
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button className='regresar' onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    //Se muestra en pantalla el turno del jugador y si hay ganador, lo muestra en pantalla
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    //Se muestra todo el tablero
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol className='renglon-regresar'>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

//Se renderiza el JUEGO en el HTML
ReactDOM.render(<Game />, document.getElementById("juego"));

//Se crea la función calculateWinner que contiene todas las posibilidades de ganar y define si hay un ganador
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  //Itera con cada índice del arreglo
  for (let i = 0; i < lines.length; i++) {
    //Destructuring
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
