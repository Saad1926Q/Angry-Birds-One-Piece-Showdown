const gameoverModal = document.getElementById("gameOverModal");
var levelEndText = document.getElementById("level-end-text");
var nextLevelButton = document.getElementById("next-level-button")

let canvas = document.getElementById("gameCanvas");

var gameModal = document.getElementById('gameModal');
var aboutModal = document.getElementById("aboutModal");
var storyModal = document.getElementById('storyModal');
var storyCloseButton = document.querySelector('.story-close')
var storyModalContent = document.querySelector('.story-content')
var storyContent = [`
    <h3 class="angry-birds-font">
        Coby, a young cabin boy, is being mistreated by Alvida, a pirate captain with a
        penchant for cruelty. Alvida subjected Coby to physical and emotional abuse, treating him as little more than a
        servant aboard her ship. She constantly berated him and forced him to do menial tasks, all while intimidating
        him with her powerful presence and fearsome reputation.
    </h3>
    <h2 class="angry-birds-font">
        objective: Defeat Alvida and rescue Coby from her tyrannical rule.
    </h2>`,
    `
    <h3 class="angry-birds-font">
    Helmeppo, the spoiled son of a corrupt marine officer, was causing trouble for Zoro, a skilled swordsman.
    Helmeppo abused his authority to oppress and extort the townspeople, including Zoro, whom he imprisoned unjustly. 
    He used his father's position to avoid consequences for his actions, making life difficult for Zoro and others.
    </h3>
    <h2 class="angry-birds-font">
        objective: Defeat Helmeppo and free Zoro from his unjust imprisonment.
    </h2>`,
    `
    <h3 class="angry-birds-font">
    Axe Hand Morgan, a ruthless marine captain, was terrorizing civilians and abusing his power.
    Morgan rules over a peaceful village with an iron fist, enforcing his will through fear and violence.
    He punishes anyone who dared to oppose him, including his own subordinates, and committed numerous atrocities to maintain control.
    </h3>
    <h2 class="angry-birds-font">
        objective: Defeat Axe Hand Morgan and liberate the village from his oppressive rule.
    </h2>
    `
]

const aboutButton = document.getElementById("about-game");
const startButton = document.getElementById("start-game");

var gameOverImage=document.querySelector(".game-over-image")

var myAudio = document.getElementById('themesong');

var levelOver = 0;
var villainHit = false;

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Body = Matter.Body,
    Collision = Matter.Collision,
    Detector = Matter.Detector,
    Events = Matter.Events;

var engine, mouseConstraint, render, runner;

var lostFlag;
var startDetectingCollisions = false;
var levelCount = 1;

var player, villain, thingy1, thingy2, thingy3, thingy4, thingy5, thingy6;
var wall1, wall2, wall3, wall4;

const villainSprites = ["sprites/alvida_new.png", "sprites/helmeppo.png", "sprites/morgan-axe.png"];
const villainX = [700, 690, 700]
const villainY = [390, 290, 300]

function Boxy(x, y, w, h) {
    return Bodies.rectangle(x, y, w, h, {
        collisionFilter: {
            category: 0x0002
        },
        render: {
            fillStyle: "#6F4E37"
        }
    });
}

function createWall(x, y, w, h) {
    return Bodies.rectangle(x, y, w, h, {
        isStatic: true, collisionFilter: {
            category: 20
        }
    })
}

function createBodies() {
    var villaintexture = villainSprites[levelCount - 1]

    player = Bodies.circle(60, 200, 40, {
        collisionFilter: {
            category: 12,
            mask: 0x0001 | 0x0004 | 0x0005 | 0x0002 | 0x0009
        },
        render: {
            sprite: {
                texture: "sprites/luffy.png"
            }
        }
    });

    villain = Bodies.circle(villainX[levelCount - 1], villainY[levelCount - 1], 35, {
        render: {
            sprite: {
                texture: villaintexture
            }
        }
    });

    switch (levelCount) {
        case 1:
            return [player, villain, new Boxy(800, 600, 40, 130),
                new Boxy(600, 600, 40, 130),
                Bodies.rectangle(700, 500, 270, 20, {
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new Boxy(800, 440, 40, 60),
                new Boxy(600, 440, 40, 60),
                Bodies.rectangle(700, 400, 250, 20, {
                    collisionFilter: {
                        category: 0x0005,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new Boxy(600, 390, 40, 80),
                new Boxy(800, 390, 40, 80),
                Bodies.rectangle(700, 310, 250, 20, {
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new createWall(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60),
                new createWall(window.innerWidth, window.innerHeight, 60, window.innerWidth),
                new createWall(window.innerWidth / 2, 0, window.innerWidth, 60),
                new createWall(0, window.innerHeight / 2, 60, window.innerWidth)]
        case 2:
            return [player, villain, new Boxy(800, 600, 40, 130),
                new Boxy(600, 600, 40, 130),
                Bodies.rectangle(700, 500, 270, 40, {
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new Boxy(800, 440, 40, 60),
                new Boxy(600, 440, 40, 60),
                Bodies.rectangle(700, 400, 270, 40, {
                    collisionFilter: {
                        category: 0x0005,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                Bodies.polygon(620, 300, 3, 50, {
                    collisionFilter: {
                        category: 0x0002
                    },
                    render: {
                        fillStyle: "#6F4E37"
                    }
                }),
                Bodies.polygon(800, 300, 3, 50, {
                    collisionFilter: {
                        category: 0x0002
                    },
                    render: {
                        fillStyle: "#6F4E37"
                    }
                }),
                Bodies.rectangle(720, 240, 400, 30, {
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new createWall(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60),
                new createWall(window.innerWidth, window.innerHeight, 60, window.innerWidth),
                new createWall(window.innerWidth / 2, 0, window.innerWidth, 60),
                new createWall(0, window.innerHeight / 2, 60, window.innerWidth)]
        case 3:
            return [player, villain, new Boxy(800, 600, 40, 130),
                new Boxy(600, 600, 40, 130),
                Bodies.rectangle(700, 500, 270, 40, {
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new Boxy(800, 440, 40, 60),
                new Boxy(600, 440, 40, 60),
                Bodies.rectangle(700, 400, 270, 40, {
                    collisionFilter: {
                        category: 0x0005,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new Boxy(500, 600, 40, 360),
                new Boxy(900, 600, 40, 360),
                Bodies.rectangle(720, 240, 540, 30, {
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002 | 0x0001 | 12
                    },
                    render: {
                        fillStyle: "#A67B5B"
                    }
                }),
                new createWall(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60),
                new createWall(window.innerWidth, window.innerHeight, 60, window.innerWidth),
                new createWall(window.innerWidth / 2, 0, window.innerWidth, 60),
                new createWall(0, window.innerHeight / 2, 60, window.innerWidth)]

    }



}

function displayLevelOver(displayMessage, buttonText, didWin) {
    if (didWin === 1) {
        gameOverImage.src="luffy-win.png"
        levelCount++;
    }
    else if(didWin===0){
        gameOverImage.src="luffy-lose.png"
    }
    if (levelCount === villainSprites.length + 1) {
        nextLevelButton.innerHTML = "Home";
        nextLevelButton.style.fontFamily="retro";
        nextLevelButton
        levelEndText.innerHTML = `
        <h3 class="retro-font">
            Congratulations!You've successfully defeated Morgan and rescued Zoro, securing him as the first member of your crew.
        </h3>
        <h3 class="retro-font">
            Luffy and Zoro, now united, set out into the vast seas, ready for an epic journey filled with endless possibilities.
            Together, they will seek out more crewmates, each with their own dreams and abilities, to join them on their quest to conquer the Grand Line.
        </h3>
        <h3 class="retro-font">
            Stay tuned for more adventures and continue to strive towards becoming the King of the Pirates!
        </h3>
        `;
        gameoverModal.style.display = "block";
    }
    else {
        levelEndText.innerHTML = displayMessage;
        nextLevelButton.innerHTML = buttonText;
        gameoverModal.style.display = "block";
    }


    console.log(levelCount);

};



function gameSetup() {
    engine = Engine.create();

    const mouse = Matter.Mouse.create(document.body);
    mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: {
            category: 0x0009,
            mask: 12
        },
        constraint: {
            stiffness: 1,
            render: {
                visible: false  // Make the constraint invisible
            }
        }
    });



    render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            wireframes: false,
            width: window.innerWidth,
            height: window.innerHeight
        }
    });

    setTimeout(function () {
        startDetectingCollisions = true;
    }, 1000)



    Events.on(engine, 'collisionStart', function (event) {
        var pairs = event.pairs;

        canvas.style.backgroundImage = "url('maps/newmap2.jpg')";
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundPosition = "top";
        canvas.style.backgroundRepeat = "no-repeat";

        if (startDetectingCollisions) {
            if (levelOver !== 1) {
                for (var i = 0, j = pairs.length; i != j; ++i) {
                    var pair = pairs[i];

                    if (pair.bodyA === villain && pair.bodyB.collisionFilter.category !== 0x0005) {
                        lostFlag = 0;
                        villainHit = true;
                        break;
                    } else if (pair.bodyB === villain && pair.bodyA.collisionFilter.category !== 0x0005) {
                        lostFlag = 0;
                        villainHit = true;
                        break;
                    }
                    else if (pair.bodyB === player && player.position.x > 380 && pair.bodyA.collisionFilter.category === 20) {
                        lostFlag = 1;
                    }
                    else if (pair.bodyA === player && player.position.x > 380 && pair.bodyB.collisionFilter.category === 20) {
                        lostFlag = 1;
                    }
                }

                if (villainHit) {
                    Events.off(engine, 'collisionStart');
                    levelOver = 1;
                    console.log("Collision");
                    Composite.remove(engine.world, player);
                    Composite.remove(engine.world, villain);
                    displayLevelOver("You win this level", "Next Level", 1)

                }
                else if (lostFlag === 1) {
                    setTimeout(function () {
                        if (!villainHit) {
                            Events.off(engine, 'collisionStart');
                            levelOver = 1
                            console.log("Collision");
                            Composite.remove(engine.world, player);
                            Composite.remove(engine.world, villain);
                            displayLevelOver("You lose ", "Try Again", 0)

                        }

                    }, 2000)

                }
            }
        }


    });

    Events.on(mouseConstraint, 'startdrag', function (event) {
        if (event.body.collisionFilter.category !== 12) {  // Only allow interaction with the player
            mouseConstraint.constraint.bodyB = null;
        }
    });



    Composite.add(engine.world, [...createBodies(), mouseConstraint]);


    Render.run(render);

    runner = Runner.create();

    Runner.run(runner, engine);

}

nextLevelButton.onclick = () => {
    Events.off(engine, 'collisionStart');
    Composite.clear(engine.world);
    Engine.clear(engine);
    Runner.stop(runner);
    gameoverModal.style.display = "none";
    if (lostFlag === 0 && levelCount <= villainSprites.length) {
        storyModalContent.innerHTML = storyContent[levelCount - 1];
        storyModal.style.display = "block";
    }
    lostFlag = 0;
    villainHit = false;
    levelOver = 0;
    startDetectingCollisions = false;
    if (nextLevelButton.innerHTML === "Home") {
        levelCount = 1;
        gameModal.style.display = "block";
    }
    else {
        gameSetup();
    }

};




aboutButton.addEventListener("click", function () {
    gameModal.style.display = "none"
    aboutModal.style.display = "block";
});

startButton.addEventListener("click", () => {
    myAudio.play()
    gameModal.style.display = "none";
    storyModalContent.innerHTML = storyContent[0];
    storyModal.style.display = "block";
})

storyCloseButton.onclick = () => {
    storyModal.style.display = "none";
    if (levelCount === 1) {
        gameSetup();
    }

}

window.addEventListener("click", function (event) {
    if (event.target == aboutModal) {
        gameModal.style.display = "block"
        aboutModal.style.display = "none";

    }
});

window.addEventListener("DOMContentLoaded", () => {
    gameModal.style.display = "block";
})