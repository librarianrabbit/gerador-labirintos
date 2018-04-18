function Maze()
{
	function rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.random = rand;

	function cellRef(px, py)
	{
		this.x = px;
		this.y = py;
	}

	var table = null;

	var start = new cellRef(-1, -1);
	var half = new cellRef(-1, -1);
	var end = new cellRef(-1, -1);

	var current = new cellRef(-1, -1);

	var sizeModifier = 1;

	var width  = 1;
	var height = 1;

	var enabled = false;

	this.onCompleted = function() { alert("Parabéns!"); };

	this.init = function(w, h, mod)
	{
		enabled = true;
		canExit = false;

		if (mod == undefined)
		{
			mod = 1;
		}

		if (w == undefined || w < 15)
		{
			width = 15;
		}
		else
		{
			width = w * mod;
		}

		if (h == undefined || h < 5)
		{
			height = 5;
		}
		else
		{
			height = h * mod;
		}

		if (table != null)
		{
			this.clear();
		}

		table = new Array();

		for (var x = 0; x < width; ++x)
		{
			table[x] = new Array();
			

			for (var y = 0; y < height; ++y)
			{
				table[x][y] = cellType.Wall;
			}
		}
	}

	this.clear = function()
	{
		enabled = false;
		canExit = false;

		if (table != null)
		{
			for (var x = 0; x < width; ++x)
			{
				for (var y = 0; y < height; ++y)
				{
					delete table[x][y];
				}

				delete table[x];
			}			

			delete table;

			table = null;
		}
	}

	this.isEnabled = function() { return enabled; }

	function insideMaze(px, py)
	{
		return (px >= 0 && py >= 0 && px < width && py < height);
	}

	function surroundingWalls(px, py)
	{
		var walls = new Array();

		if (insideMaze(px, py))
		{
			function checkWall(out, px, py)
			{
				if (insideMaze(px, py))
				{
					if (table[px][py] == cellType.Wall)
					{
						out.push(new cellRef(px, py));
					}
				}
				else
				{
					out.push(new cellRef(-1, -1));
				}
			}

			// Top
			py -= 1;
			checkWall(walls, px, py);

			// Bottom
			py += 2;
			checkWall(walls, px, py);

			// Left
			px -= 1;
			py -= 1;
			checkWall(walls, px, py);

			// Right
			px += 2;
			checkWall(walls, px, py);
		}

		return walls;
	}

	function buildFrom(px, py, steps, type)
	{
		if (px == -1 || py == -1)
		{
			return;
		}

		var sq = new Array();

		var i = 0;

		for (i = 0; i < steps;)
		{
			var walls = surroundingWalls(px, py);
			var w = -1;

			while (walls.length > 0)
			{
				var wa = walls.length;
				w = 0;

				if (wa < 1)
				{
					break;
				}
				else if (wa > 1)
				{
					w = rand(0, wa - 1);
				}

				var tx = walls[w].x;
				var ty = walls[w].y;

				var swalls = surroundingWalls(tx, ty);

				if (swalls.length < 3)
				{
					walls.splice(w, 1);
					w = -1;

					continue;
				}

				break;
			}

			if (walls.length < 1 || w < 0)
			{
				if (sq.length == 0)
				{
					break;
				}

				var tmp = sq.pop();

				px = tmp.x;
				py = tmp.y;

				table[px][py] = cellType.Path;

				if (sq.length == 0)
				{
					break;
				}

				continue;
			}

			sq.push(new cellRef(px, py));

			px = walls[w].x;
			py = walls[w].y;

			table[px][py] = cellType.Path;

			++i;
		}

		table[px][py] = type;
		sq.push(new cellRef(px, py));

		return sq;
	}

	this.gen = function()
	{
		start.x = rand(0, width - 1);
		start.y = rand(0, height - 1);

		table[start.x][start.y] = cellType.Start;

		var sq = buildFrom(start.x, start.y, Math.floor((width * height) / rand(4, 8)), cellType.Half);
		var s = sq.length;

		if (s == 0)
		{
			return;
		}

		half.x = sq[s - 1].x;
		half.y = sq[s - 1].y;

		var q = 0;

		if (s > 1)
		{
			q = rand(0, s - 1);
		}

		var se = buildFrom(sq[q].x, sq[q].y, Math.floor((width * height) / rand(6, 10)), cellType.EndI);
		q = se.length;

		end.x = se[q - 1].x;
		end.y = se[q - 1].y;

		if (s > 0)
		{
			if (s > 1)
			{
				sq.splice(s, 1);
			}

			sq.splice(0, 1);
		}

		if (q > 0)
		{
			if (q > 1)
			{
				se.splice(s, 1);
			}

			se.splice(0, 1);
		}

		for (var i = 0; i < sq.length; ++i)
		{			
			buildFrom(sq[i].x, sq[i].y, Math.floor((width * height) - sq.length - i - se.length), cellType.Path);
		}

		for (var i = 0; i < se.length; ++i)
		{
			buildFrom(se[i].x, se[i].y, Math.floor((width * height) - sq.length - i - se.length), cellType.Path);
		}

		table[start.x][start.y] = cellType.Start;
		table[half.x][half.y] = cellType.Half;
		table[end.x][end.y] = cellType.EndI;

		current.x = start.x;
		current.y = start.y;

		table[current.x][current.y] = cellType.Cur;
	}

	var cellChar = "#";

	function cellColor(id, color)
	{
		var cell = document.createElement('span');
		cell.id = id;

		cell.style.color = color;
		cell.style.backgroundColor = color;

		cell.appendChild(document.createTextNode(cellChar));

		return cell;
	}

	var cellType = {
				Wall : 0,
				Path : 1,
				Cur  : 2,
				Start: 3,
				Half : 4,
				EndI : 5,
				EndII: 6,
				Sol  : 7
			};

	var cellHtml = {
				0 : "gray",
				1 : "black",
				2 : "orange",
				3 : "blue",
				4 : "yellow",
				5 : "red",
				6 : "lightgreen",
				7 : "darkgreen"
			};

	function createCell(id, type)
	{
		return cellColor(id, cellHtml[type]);
	}

	function updateCell(px, py, type)
	{
		var cell = document.getElementById("maze_" + px + "x" + py);

		if (cell)
		{
			table[px][py] = type;
			cell.style.color = cellHtml[type];
			cell.style.backgroundColor = cellHtml[type];
		}
	}

	this.draw = function(e)
	{
		if (table != null)
		{
			for (var x = 0; x < width + 2; ++x)
			{
				e.appendChild(createCell("up_" + x, cellType.Wall));
			}

			e.appendChild(document.createElement('br'));

			for (var y = 0; y < height; ++y)
			{
				e.appendChild(createCell("left_" + y, cellType.Wall));

				for (var x = 0; x < width; ++x)
				{
					e.appendChild(createCell("maze_" + x + "x" + y, table[x][y]));
				}

				e.appendChild(createCell("right_" + y, cellType.Wall));

				e.appendChild(document.createElement('br'));
			}

			for (var x = 0; x < width + 2; ++x)
			{
				e.appendChild(createCell("bottom_" + x, cellType.Wall));
			}
		}
	}

	this.direction = {
				Up   : 0,
				Left : 1,
				Right: 2,
				Down : 3
			 };

	var canExit = false;

	this.move = function(dir)
	{
		var oldRef = new cellRef(current.x, current.y);

		if (dir == this.direction.Up)
		{
			if (current.y - 1 < 0)
			{
				return false;
			}

			if (table[current.x][current.y - 1] == cellType.Wall)
			{
				return false;
			}

			current.y -= 1;
		}
		else if (dir == this.direction.Left)
		{
			if (current.x - 1 < 0)
			{
				return false;
			}

			if (table[current.x - 1][current.y] == cellType.Wall)
			{
				return false;
			}

			current.x -= 1;
		}
		else if (dir == this.direction.Right)
		{
			if (current.x + 1 >= width)
			{
				return false;
			}

			if (table[current.x + 1][current.y] == cellType.Wall)
			{
				return false;
			}

			current.x += 1;
		}
		else if (dir == this.direction.Down)
		{
			if (current.y + 1 >= height)
			{
				return false;
			}

			if (table[current.x][current.y + 1] == cellType.Wall)
			{
				return false;
			}

			current.y += 1;
		}

		updateCell(current.x, current.y, cellType.Cur);

		if (current.x == half.x && current.y == half.y)
		{
			canExit = true;

			updateCell(end.x, end.y, cellType.EndII);
		}

		if (oldRef.x == start.x && oldRef.y == start.y)
		{
			updateCell(oldRef.x, oldRef.y, cellType.Start);
		}
		else if (oldRef.x == half.x && oldRef.y == half.y)
		{
			if (canExit == true)
			{
				updateCell(oldRef.x, oldRef.y, cellType.Path);
			}
			else
			{
				updateCell(oldRef.x, oldRef.y, cellType.Half);
			}
		}
		else if (oldRef.x == end.x && oldRef.y == end.y)
		{
			if (canExit == true)
			{
				updateCell(oldRef.x, oldRef.y, cellType.EndII);
			}
			else
			{
				updateCell(oldRef.x, oldRef.y, cellType.EndI);
			}
		}
		else
		{
			updateCell(oldRef.x, oldRef.y, cellType.Path);
		}

		if (current.x == end.x && current.y == end.y && canExit == true)
		{
			this.clear();

			if (this.onCompleted)
			{
				this.onCompleted();
			}
		}

		return true;
	}
}
