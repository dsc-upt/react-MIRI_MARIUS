import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const finished = (props.highlight ? "highlightSquare" : "square") ;
    let player;
    let className;
    if(finished === "highlightSquare"){
        player = props.currentPlayer;
        let team;
        if(player === 'X'){
            team = " blueH";
        }
        else{
            team = " redH";
        }
        className = finished + team;
    }
    else{
        className = finished;
    }

    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {


    renderSquare(i) {
        const winLine = this.props.winLine;
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={winLine && winLine.includes(i)}
                currentPlayer = {this.props.squares[i]}
            />
        );
    }

    render() {
        const size = 3;
        let squares =[];
        for(let i=0; i<size; i++){
            let row = [];
            for(let j=0; j<size; j++){
                row.push(this.renderSquare(i*size + j));
            }
            squares.push(<div className="board-row">{row}</div>);
        }
        return (
            <div>{squares}</div>
            // <div>{
            //     for(let row = 0; this.row != 3; this.row++){
            //     <div className="board-row">
            //     for(let col = 0; this.col != 3; this.col++)
            // {this.renderSquare(this.row * 3 + this.col)}
            //     </div>
            // }
            // }
            // </div>

        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            finished: false,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            this.setState(
            {
               finished: true,
            });
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    lastMove: i
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
    render() {
        let winnerBg = " ";
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const stepNumber = this.state.stepNumber;
        const winObj = calculateWinner(current.squares);
        const winner = calculateWinner(current.squares).winner;
        const moves = history.map((step, move) => {
            const lastMove = step.lastMove;
            const col = 1 + lastMove % 3;
            const row = 1 + Math.floor(lastMove / 3);
            const desc = move ?
                `Go to move # ${move} (${col}, ${row})` :
                // 'Go to move #' + move + '(' + col  +',' + row + ')':
                'Go to game start';

            return (
                <li key={move}>
                    <button
                        className={"transition historyButtons"}
                        style={move === stepNumber ? {fontWeight: "bold", padding: "5px"} : {} }
                        onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;

        if (winner) {
            winnerBg = ( this.state.xIsNext ? "bgY" : "bgX" )
            status = "Winner: " + winner;
        } else if ((history.length === 10) && (current === history[9]))
        {
            status = "Draw (╯°□°）╯︵ ┻━┻";
        }
        else
        {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
        return (
            <div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={i => this.handleClick(i)}
                            winLine={winObj.line}
                        />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{moves}</ol>
                    </div>
                </div>
                <div className={"bg " + winnerBg}> </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i]
            };
        }
    }
    return {
        winner: null
    };
}

