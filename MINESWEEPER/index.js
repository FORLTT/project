document.addEventListener('DOMContentLoaded', function() {
    const flagLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const grid = document.querySelector('.grid')
    const width = 10
    let bombAmount = 20 //炸弹数量
    let squares = []
    let numberArray = []
    let isGameOver = false
    let flags = 0

    function createBoard() {
        flagLeft.innerHTML = bombAmount

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray  = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for(let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.id = i
            // square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function(e) {
                click(square)
            })
            // cntrl and left click
            square.addEventListener('contextmenu', function() {
                addFlag(square) 
            })
        }

        // add numbers
        for(let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)
            if(shuffledArray[i].includes('valid')) {
                if(i > 0 && !isLeftEdge && shuffledArray[i - 1].includes('bomb')) total++ //目标点左边
                if(i > width - 1 && shuffledArray[i - width].includes('bomb')) total++ //目标点上边
                if(!isRightEdge && shuffledArray[i + 1].includes('bomb')) total++ //目标点右边
                if(i < width * width - width && shuffledArray[i + width].includes('bomb')) total++ //目标点下边
                if(i > width - 1 && !isLeftEdge && shuffledArray[i - 1 - width].includes('bomb')) total++  //目标点左上
                if(i < width * width - width && !isLeftEdge && shuffledArray[i - 1 + width].includes('bomb')) total++  //目标点左下
                if(i > width - 1 && !isRightEdge && shuffledArray[i + 1 - width].includes('bomb')) total++ //目标点右上
                if(i < width * width - width && !isRightEdge && shuffledArray[i + 1 + width].includes('bomb')) total++  //目标点右下
                squares[i].setAttribute('data', total)
                numberArray[i] = total
            } else {
                numberArray[i] = -1
            }
        }
    }
    createBoard()

    function click(square) {
        let currentId = square.id
        if(isGameOver || square.classList.contains('checked') || square.classList.contains('falg')) return
        if(numberArray[currentId] === -1) {
            gameOver()
        } else {
            const total = numberArray[currentId]
            if(total !== 0) {
                if(total === 1) square.classList.add('one')
                if(total === 2) square.classList.add('two')
                if(total === 3) square.classList.add('three')
                if(total === 4) square.classList.add('four')
                square.innerHTML = total
            } else {
                checkSquare(square)
            }
        }
        square.classList.add('checked')
    }
    function addFlag(square) {
        if(isGameOver) return
        const currentId = square.id
        if(!square.classList.contains('checked') && (flags < bombAmount)) {
            if(!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
                flagLeft.innerHTML = bombAmount - flags
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                flagLeft.innerHTML = bombAmount - flags
            }
            checkForWin()
        }
    }
    function gameOver() {
        result.innerHTML = 'BOOM Game Over!'
        isGameOver = true
        squares.forEach((squareItem, squareIndex) => {
            if(numberArray[squareIndex] === -1) {
                squareItem.innerHTML = '💣'
                squareItem.classList.add('checked')
            }
        })
    }

    function checkForWin() {
        let matches = 0
        for(let i = 0; i < squares.length; i++) {
            if(squares[i].classList.contains('flag') && numberArray[i] === -1) {
                matches++
            }
        }
        if(matches === bombAmount) {
            result.innerHTML = 'YOU WIN!'
            isGameOver = true
        }
    }

    function checkSquare(square) {
        const currentId = Number(square.id)
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)
        console.log(currentId);
        setTimeout(() => {
            //目标点左边
            if(currentId > 0 && !isLeftEdge) {
                const newSquare = document.getElementById(currentId - 1)
                click(newSquare)
            }
            //目标点上边
            if(currentId > width - 1) {
                const newSquare = document.getElementById(currentId - width)
                click(newSquare)
            }
            //目标点右边
            if(!isRightEdge) {
                const newSquare = document.getElementById(currentId + 1)
                click(newSquare)
            }
            //目标点下边
            if(currentId < width * width - width) {
                const newSquare = document.getElementById(currentId + width)
                click(newSquare)
            }
            //目标点左上
            if(currentId > width && !isLeftEdge) {
                const newSquare = document.getElementById(currentId - 1 - width)
                click(newSquare)
            }
            //目标点左下
            if(currentId < width * width - width && !isLeftEdge) {
                const newSquare = document.getElementById(currentId - 1 + width)
                click(newSquare)
            }
            //目标点右上
            if(currentId > width - 1 && !isRightEdge) {
                const newSquare = document.getElementById(currentId + 1 - width)
                click(newSquare)
            }
            //目标点右下
            if(currentId < width * width - width && !isRightEdge) {
                const newSquare = document.getElementById(currentId + 1 + width)
                click(newSquare)
            }
        }, 10)
    }
})