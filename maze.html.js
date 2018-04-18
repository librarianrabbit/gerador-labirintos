var maze = new Maze();

var movement = -1;
var tid = -1;

var steps = 0;

document.onkeydown = keyDown;
document.onkeyup = keyUp;

function keyDown(e)
{
	var id = (window.event) ? event.keyCode : e.keyCode;

	switch(id)
	{
		case 37:
			movement = maze.direction.Left;
			startMoving();
			break;
 
		case 38:
			movement = maze.direction.Up;
			startMoving();
			break;

		case 39:
			movement = maze.direction.Right;
			startMoving();
			break;

		case 40:
			movement = maze.direction.Down;
			startMoving();
			break;
	}
}

function keyUp(e)
{
	var id = (window.event) ? event.keyCode : e.keyCode;

	switch (id)
	{
		case 37:
		case 38:
		case 39:
		case 40:
			stopMoving();
			movement = -1;
			break;
	}
}

var diff = 0;

function reloadMaze()
{
	steps = 0;
	++diff;

	document.getElementById("maze").innerHTML = "";

	if (diff > 10)
	{
		maze.init(15 + maze.random(0, diff / 2), 5 + maze.random(0, diff / 2), 1 + Math.floor(diff / 10));
	}
	else
	{
		maze.init(15 + maze.random(0, diff), 5 + maze.random(0, diff), 1 + maze.random(0, diff / 3));
	}

	maze.gen();

	drawMaze();
}

function drawMaze()
{
	maze.draw(document.getElementById("maze"));

	maze.onCompleted = function()
	{
		reloadMaze();
	}
}

function startMoving()
{
	if (tid == -1 && maze.isEnabled())
	{
		doMovement();
		tid = setInterval(function() { doMovement(); }, 100);
	}
}

function doMovement()
{
	if (maze.move(movement))
	{
		steps++;
	}
}

function stopMoving()
{
	if (tid != -1)
	{
		clearInterval(tid);
		tid = -1;
	}

	document.getElementById("steps").innerHTML = steps;
}
