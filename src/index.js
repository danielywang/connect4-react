import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.val}
      </button>
    );
  }
}


class Restart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reset: props.resetGame
    }
  }

  render() {
    return (
      <div className="center">
        <button type="button" className="restart center" onClick={() => this.state.reset()}>Restart Game
        </button>
      </div>
    )
  }
}

class Ctrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updates: props.update
    }
  }

  render() {
    return (
      <button className="ctrl" onClick={() => this.state.updates(this.props.val)}>
        {this.props.next ? "🔴" : "🔵"}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    const arr = [];
    for (let i = 0; i < 6; i++) {
      const t_arr = []
      for (let j = 0; j < 7; j++) {
        t_arr.push(null);
      }
      arr.push(t_arr);
    }
    this.state = {
      grid: arr,
      redNext: true,
      over: false,
      winner: null,
    }
  }
  renderSquare(i, k) {
    return <Square val={i} key={k} />;
  }

  getPiece(x, y) {
    return this.state.grid[x][y];
  }

  addPiece(x) {
    if (!this.state.over) {
      let legrid = this.state.grid.slice();
      for (let i = 5; i >= 0; i--) {
        if (legrid[i][x] == null) {
          legrid[i][x] = this.state.redNext ? "🔴" : "🔵";
          this.setState({ grid: legrid, redNext: !this.state.redNext });
          return;
        }
      }
      return false;
    }
  }

  resetGame() {
    const arr = [];
    for (let i = 0; i < 6; i++) {
      const t_arr = []
      for (let j = 0; j < 7; j++) {
        t_arr.push(null);
      }
      arr.push(t_arr);
    }
    this.setState({
      grid: arr,
      redNext: true,
      winner: null,
      over: false
    })
  }

  render() {
    let status;
    if (!this.state.over) {
      let p_winner = getWinner(this.state.grid);
      if (p_winner) {
        status = "The winner is " + p_winner;
        this.setState({ over: true, winner: p_winner });
      }
      else {
        status = "Player "+(this.state.redNext ? "🔴" : "🔵") + "'s turn";

      }
    }
    else {
      status = "The winner is " + this.state.winner;
    }
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const rsq = [];
      for (let j = 0; j < 7; j++) {
        rsq.push(this.renderSquare(this.state.grid[i][j], 7 * i + j))
      }

      rows.push(<div key={i} className="board-row">{rsq}</div>)
    }

    const ct_row = []
    for (let i = 0; i < 7; i++) {
      ct_row.push(<Ctrl val={i} key={i} next={this.state.redNext} update={() => this.addPiece(i)} />);
    }

    return (
      <div >
        <div className="status">{status}</div>
        <div className="board-row select">{ct_row} </div>
        <div className="gameGrid">{rows}</div>
        <Restart resetGame={() => this.resetGame()} />

      </div>
    );
  }
}

function getWinner(grid) {
  for (let i = 0; i < 3; i++) {
    const r = grid.slice(i, i + 4);
    let tr = [];
    for (let j = 0; j < 4; j++) {
      tr = [];
      r.forEach(e => { tr.push(e.slice(j, j + 4)) })
      //diag
      if (tr[0][0] && tr[0][0] === tr[1][1] && tr[1][1] === tr[2][2] && tr[2][2] === tr[3][3]) {
        return tr[0][0];
      }
      else if (tr[0][3] && tr[0][3] === tr[1][2] && tr[1][2] === tr[2][1] && tr[2][1] === tr[3][0]) {
        return tr[0][3];
      }
      //horiz
      for (let p = 0; p < 4; p++) {
        if (tr[p][0] && tr[p][0] === tr[p][1] && tr[p][1] === tr[p][2] && tr[p][2] === tr[p][3]) {
          return tr[p][0];
        }
      }
      //vert
      for (let q = 0; q < 4; q++) {
        if (tr[0][q] && tr[0][q] === tr[1][q] && tr[1][q] === tr[2][q] && tr[2][q] === tr[3][q]) {
          return tr[0][q];
        }
      }

    }
  }
  return null;
}

ReactDOM.render(
  <div className="play">
    <div className="center">
      <Board />
    </div>
    <div className="info center">
      <div>
        <p>Welcome! Place a piece in the orange box to get started.</p>
      </div>
      <div>
      <img src="/react_logo.png" width="200px" style={{display:'block',margin:'auto'}}></img>
      <p className='center' style={{textAlign:'center'}}>built with react.js</p>
      </div>
    </div>
  </div>,
  document.getElementById('root')
);

