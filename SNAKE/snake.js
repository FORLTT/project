// 用于防抖
let lastKeyDownTime = 0;
const KEYDOWN_DEBOUNCE_MS = 50; // 防抖时间，例如100毫秒

/**
 * 蛇类，用于游戏中的蛇的逻辑和行为。
 */
class Snake {
    /**
     * 蛇的构造函数。
     * @param {number} x - 蛇起始位置的x坐标。
     * @param {number} y - 蛇起始位置的y坐标。
     * @param {number} size - 蛇的尺寸。
     */
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        // 初始化蛇的身体，初始只有一个单元。
        this.tail = [{x: this.x, y: this.y}];
        // 蛇的x和y方向的旋转角度，用于移动。
        this.rotateX = 0;
        this.rotateY = 1;
        // 蛇是否在增长的标志。
        this.grow = false;
    }

    /**
     * 移动蛇，使其根据旋转角度和身体长度更新位置。
     */
    move()  {
        const head = this.tail[this.tail.length - 1];
        let newRect = { x: head.x + this.rotateX * this.size, y: head.y + this.rotateY * this.size };
        
        // 如果蛇在增长，则添加一个新的身体单元，否则移除尾部单元。
        if (this.grow) {
            this.tail.push(newRect);
            this.grow = false;
        } else {
            this.tail.shift();
            this.tail.push(newRect);
        }
    }

    /**
     * 处理键盘事件，改变蛇的移动方向。
     * @param {KeyboardEvent} event - 键盘事件对象。
     */
    keyDownEvent(event) {
        const currentTime = new Date().getTime();
        if (currentTime - lastKeyDownTime < KEYDOWN_DEBOUNCE_MS) return; // 防抖处理
        lastKeyDownTime = currentTime;
        const { key } = event;
        // 检查是否尝试反转方向，如果是，则不作任何处理。
        if ((key === 'ArrowRight' && this.rotateX === -1) || 
            (key === 'ArrowLeft' && this.rotateX === 1) || 
            (key === 'ArrowUp' && this.rotateY === 1) || 
            (key === 'ArrowDown' && this.rotateY === -1)) {
            return;
        }
        // 根据按下的键改变蛇的旋转角度。
        switch (key) {
            case 'ArrowLeft':
                if (this.rotateX !== 1) {
                    this.rotateX = -1;
                    this.rotateY = 0;
                }
                break;
            case 'ArrowUp':
                if (this.rotateY !== 1) {
                    this.rotateX = 0;
                    this.rotateY = -1;
                }
                break;
            case 'ArrowRight':
                if (this.rotateX !== -1) {
                    this.rotateX = 1;
                    this.rotateY = 0;
                }
                break;
            case 'ArrowDown':
                if (this.rotateY !== -1) {
                    this.rotateX = 0;
                    this.rotateY = 1;
                }
                break;
        }
    }
    /**
     * 更新蛇的位置，同时检查是否撞到自身。
     */
    update() {
        checkCollisionWithBody();
        this.move();
    }
}

/**
 * 苹果类，用于游戏中的食物/苹果的逻辑和行为。
 * @param {Snake} snake - 蛇对象，用于确定苹果的位置。
 * @param {HTMLCanvasElement} canvas - 游戏画布。
 */
class Apple {
    constructor(snake, canvas) {
        let isTouching, x, y
        do {
            // 确保苹果不会生成在边界上
            x = Math.floor(Math.random() * (canvas.width / snake.size - 2) + 1) * snake.size;
            y = Math.floor(Math.random() * (canvas.height / snake.size - 2) + 1) * snake.size;
            isTouching = snake.tail.some(rect => rect.x === x && rect.y === y);
        } while(isTouching)

        this.x = x;
        this.y = y;
        this.color = 'red';
        this.size = snake.size;
    }/**
     * 绘制苹果。
     */
    draw() {
        createRect(this.x, this.y, this.size, this.size, this.color);
    }
}


// 获取游戏画布和初始化蛇和苹果对象。
let canvas = document.getElementById('canvas');
let snake = new Snake(0, 0, 20);  
let apple = new Apple(snake, canvas);
let canvasCtx = canvas.getContext('2d')

// 游戏循环函数，用于更新游戏状态和绘制。
window.onload = () => {
    gameLoop()
}

function gameLoop() {
    setInterval(() => {
        update();
        draw();
    }, 1000 / 10); // 设置游戏循环的帧率。
}

// 更新游戏状态的函数，包括蛇的移动和碰撞检测。
function update() {
    // 更新蛇的位置
    updateSnake();
    //碰撞检测
    checkHitWall();
}

// 更新蛇的位置和处理苹果的逻辑。
function updateSnake() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    updateApple();
}

// 处理蛇吃到苹果的逻辑，更新蛇的长度并生成新的苹果。
function updateApple() {
    const head = snake.tail[snake.tail.length - 1];
    if (head.x === apple.x && head.y === apple.y) {
        snake.grow = true;
        apple = new Apple(snake, canvas);
    }
}

// 碰撞检测 
function checkHitWall() {
    const headTail = snake.tail[snake.tail.length - 1]

    //检查蛇是否撞墙，实现墙的环绕效果。
    if (headTail.x < 0) {
        // 从右侧出现
        headTail.x = canvas.width - snake.size; 
    } else if (headTail.x >= canvas.width) {
        // 从左侧出现
        headTail.x = 0;  
    }
    if (headTail.y < 0) {
        // 从下侧出现
        headTail.y = canvas.height - snake.size;
    } else if (headTail.y >= canvas.height) {
         // 从上侧出现
        headTail.y = 0;
    }

    //检测蛇头是否与蛇身相撞 则结束游戏
    for (let i = 0; i < snake.tail.length - 1; i++) {
        if (headTail.x === snake.tail[i].x && headTail.y === snake.tail[i].y) {
            gameOver();
            return;
        }
    }
}

// 绘制游戏画面的函数。
function draw() {
    createRect(0, 0, canvas.width, canvas.height, 'black');
    createRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.tail.length; i++) {
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5, snake.size - 5, snake.size - 5, 'green');
    }
    apple.draw();
    canvasCtx.font = '20px Arial';
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillText('Source：' + (snake.tail.length - 1), canvas.width - 120, 18);
}
// 绘制矩形的辅助函数。
function createRect(x, y, width, height, color = 'black') {
    canvasCtx.fillStyle = color;
    canvasCtx.fillRect(x, y, width, height);
}
//游戏介绍
function gameOver() {
    alert('Game Over！')
    // 重新开始游戏
    snake.tail = [{ x: snake.x, y: snake.y }];
    snake.rotateX = 0;
    snake.rotateY = 1;
    apple = new Apple(snake, canvas);
}
// 添加键盘控制的逻辑。
function addKeyboardControls() {
    window.removeEventListener('keydown', snake.keyDownEvent.bind(snake));
    window.addEventListener('keydown', snake.keyDownEvent.bind(snake));
}
addKeyboardControls()