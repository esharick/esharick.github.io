document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').addEventListener('submit', function(e) {
        e.preventDefault();
        var name = document.getElementById('Username').value;
        document.getElementById('info').innerHTML = "Your email is " + name;
    });

    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');

    let currentPlayer = 'X';

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (!cell.textContent) {
                cell.textContent = currentPlayer;
                cell.classList.add(currentPlayer);
                
                if (checkWinner()) {
                    alert(`${currentPlayer} wins!`);
                    resetBoard();
                } else if (isBoardFull()) {
                    alert('It\'s a draw!');
                    resetBoard();
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            }
            });

        function checkWinner() {
            const winningCombos = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];

            return winningCombos.some(combo => {
                const [a, b, c] = combo;
                return cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent;
            });
        }

        function isBoardFull() {
            return Array.from(cells).every(cell => cell.textContent);
        }

        function resetBoard() {
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('X', 'O');
            });

            currentPlayer = 'X';
        }
    });
});