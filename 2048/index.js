document.addEventListener('DOMContentLoaded', () => {
    const gridDisPlay = document.querySelector('.grid')
    const scoreDisPlay = document.querySelector('.score')
    const resultDisplay = document.querySelector('.result')
    let squares = []
    const width = 4
    let score = 0
    let oldStr = ''

    function createdBoard() {
        // 清空数组以避免内存泄漏
        squares = []; 
        // 清空网格以避免DOM元素堆积
        gridDisPlay.innerHTML = ''; 
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement('div');
            square.innerHTML = 0;
            gridDisPlay.appendChild(square);
            squares.push(square);
        }
        generate()
        generate()
    }
    createdBoard()

    function generate() {
        const newStr = squares.map(el => el.innerHTML).join('')
        if(oldStr === newStr) {
            checkForGameOver();
            return
        }
        score ++
        scoreDisPlay.innerHTML = score - 2
        let randomNumber = Math.floor(Math.random() * squares.length)
        while (squares[randomNumber].innerHTML !== '0') {
            randomNumber = Math.floor(Math.random() * squares.length);
        }
        // 以50%的概率生成2或4，增加游戏初期的变数
        squares[randomNumber].innerHTML = Math.random() < 0.5 ? '2' : '4'; 
        checkForGameOver();
    }

    function control(e) {
        oldStr = squares.map(el => el.innerHTML).join('')
        if (e.keyCode === 37) {
            moveRightAndLeft('left');
        } else if (e.keyCode === 38) {
            moveUpAndDown('up');
        } else if (e.keyCode === 39) {
            moveRightAndLeft('right');
        } else if (e.keyCode === 40) {
            moveUpAndDown('down');
        }
        if(e.keyCode >= 37 && e.keyCode <= 40) {
            // 保证每次移动后只生成一个新数字
            generate(); 
            addColors()
            checkForWin()
        }
    }

    document.addEventListener('keyup', control)
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if(squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = 'You Win!'
                document.removeEventListener('keyup', control)
                setTimeout(() => clear(), 3000)
            }
        }
    }

    function clear() {
        resultDisplay.innerHTML = '';
        gridDisPlay.innerHTML = '';
        score = 0;
        scoreDisPlay.innerHTML = score;
        createdBoard(); // 重新开始游戏
        addColors()
        document.addEventListener('keyup', control)
    }
    function addColors() {
        const colorArr = {
            "0": { background: '#eee4de', color: '#eee4de', size: '50px' },
            "2": { background: '#EFEFEF', color: 'gray', size: '50px' },
            "4": { background: '#FFD700', color: '#FFF', size: '50px' },
            "8": { background: '#FFA500', color: '#FFF', size: '50px' },
            "16": { background: '#FF6347', color: '#FFF', size: '50px' },
            "32": { background: '#CD5C5C', color: '#FFF', size: '50px' },
            "64": { background: '#8B0000', color: '#FFF', size: '50px' },
            "128": { background: '#4169E1', color: '#FFF', size: '50px' },
            "256": { background: '#006400', color: '#FFF', size: '46px' },
            "512": { background: '#FFFF00', color: 'gray', size: '46px' },
            "1024": { background: '#EE82EE', color: '#FFF', size: '40px' },
            "2048": { background: '#FFDAB9', color: '#FFF', size: '40px' },
        }
        for(let i = 0; i < squares.length; i++) {
            const num = squares[i].innerHTML
            const { background, color, size } = colorArr[num]
            squares[i].style.background = background
            squares[i].style.color = color
            squares[i].style.fontSize = size
        }
    }
    addColors()

    function combineAndShift(row, direction) {
        let nonZeroElements = row.filter(num => num !== 0);
    
        switch(direction) {
            case 'up':
            case 'left':
                let tempRow = [];
                for(let num of nonZeroElements) {
                    if(tempRow.length > 0 && tempRow[tempRow.length - 1] === num) {
                        tempRow[tempRow.length - 1] *= 2;
                    } else {
                        tempRow.push(num);
                    }
                }
                nonZeroElements = tempRow;
                break;
            case 'down':
            case 'right':
                for(let i = nonZeroElements.length - 1; i > 0; i--) { // 从右向左遍历以简化合并逻辑
                    if(nonZeroElements[i] === nonZeroElements[i - 1]) {
                        nonZeroElements[i - 1] *= 2; // 合并数字
                        nonZeroElements.splice(i, 1); // 移除已经合并的数字
                    }
                }
                break;
            default:
                throw new Error('Invalid direction. Must be "up", "down", "left", or "right".');
        }
    
        // 根据方向补充空位
        const missingSpaces = row.length - nonZeroElements.length;
        let newRow;
        switch(direction) {
            case 'up':
            case 'left':
                newRow = nonZeroElements.concat(Array(missingSpaces).fill(0));
                break;
            case 'down':
            case 'right':
                newRow = Array(missingSpaces).fill(0).concat(nonZeroElements);
                break;
        }
    
        return newRow;
    }
    function moveRightAndLeft(direction) {
        for(let i = 0; i < width * width; i++) {
            if(i % width === 0) {
                let row = []
                for(let j = 0; j < width; j++) {
                    row.push(parseInt(squares[i + j].innerHTML))
                }
                let newRow = combineAndShift(row, direction);
                // 将处理后的行重新写入squares
                for(let j = 0; j < width; j++) {
                    squares[i + j].innerHTML = newRow[j];
                }
            }
        }
    }
    function moveUpAndDown(direction) {
        for(let i = 0; i < width; i++) {
            let column = []
            for(let j = 0; j < width; j++) {
                column.push(parseInt(squares[i + (width * j)].innerHTML))
            }
            let newColumn = combineAndShift(column, direction);
            for(let j = 0; j < width; j++) {
                squares[i + (width * j)].innerHTML = newColumn[j];
            }
        }
    }
    function areAdjacentElementsEqual(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                return true;
            }
        }
        return false;
    }   
    function getHorizontalArr() {
        let flag = false
        for(let i = 0; i < width * width; i++) {
            if(i % width === 0) {
                let row = []
                for(let j = 0; j < width; j++) {
                    row.push(parseInt(squares[i + j].innerHTML))
                }
                if(areAdjacentElementsEqual(row)) {
                    flag = true
                    break
                }
            }
        }
        return flag
    }
    function getVerticalArr() {
        let flag = false
        for(let i = 0; i < width; i++) {
            let column = []
            for(let j = 0; j < width; j++) {
                column.push(parseInt(squares[i + (width * j)].innerHTML))
            }
            if(areAdjacentElementsEqual(column)) {
                flag = true
                break
            }
        }
        return flag
    }
    function checkForGameOver() {
        if(getHorizontalArr() || getVerticalArr()) {
            return;
        }
        let zeros = squares.filter(square => square.innerHTML === '0').length;
        if (zeros === 0) {
            resultDisplay.innerHTML = '游戏结束!';
            document.removeEventListener('keyup', control);
        }
    }
})