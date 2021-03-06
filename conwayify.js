javascript:(function() {
  window.GRAPH_OF_LIFE = window.GRAPH_OF_LIFE || {
    interval_id: null,
  };


  var svg = document.getElementsByClassName('js-calendar-graph-svg')[0],
      graph = svg.children[0],
      columns = [].filter.call(graph.children, function(node) { return node.tagName === 'g'; }),
      grid = create_grid_from_columns(columns);


  hide_edge_columns(columns);


  if (window.GRAPH_OF_LIFE.interval_id) {
    clearInterval(window.GRAPH_OF_LIFE.interval_id);
    window.GRAPH_OF_LIFE.interval_id = null;
  } else {
    window.GRAPH_OF_LIFE.interval_id = setInterval(life_iteration, 500);
  }


  function create_grid_from_columns(svg_columns) {
    /* ignore first and last cols, since they might be different heights */
    return [].map.call(svg_columns.slice(1, svg_columns.length - 1), function(col) {
      return [].map.call(col.children, function(node) {
        var is_alive = node.getAttribute('fill') !== '#ebedf0';
        return new Cell(is_alive, node);
      });
    });
  }


  function hide_edge_columns(svg_columns) {
    function color_white(svg_node) { svg_node.setAttribute('fill', '#ffffff'); }
    [].forEach.call(svg_columns[0].children, color_white);
    [].forEach.call(svg_columns[svg_columns.length-1].children, color_white);
  }


  function life_iteration() {
    /* iterate over full grid twice, first to count neighbors, then to apply Life rules */
    grid.forEach(function(column, x) {
      column.forEach(function(cell, y) {
        cell.living_neighbors_count = count_living_neighbors_at(x, y);
      });
    });

    grid.forEach(function(column, x) {
      column.forEach(function(cell, y) {
        cell.apply_life_rules();
      });
    });
  }


  function count_living_neighbors_at(x, y) {
    var neighbs = 0,
        positions = [[x-1,y-1], [x-0,y-1], [x+1,y-1],
                     [x-1,y-0], /* ^_^  */ [x+1,y-0],
                     [x-1,y+1], [x-0,y+1], [x+1,y+1]];

    positions.forEach(function(point) {
      var x = point[0], y = point[1];

      if (x < 0 ||
          y < 0 ||
          x > grid.length - 1 ||
          y > grid[0].length - 1) return;

      if (grid[x][y].alive) neighbs++;
    });

    return neighbs;
  }


  function Cell(alive, svg_el_reference) {
    this.alive = alive || false;
    this.svg_el_reference = svg_el_reference || null;
    this.living_neighbors_count = 0;
  }

  Cell.prototype.set_alive = function() {
    this.alive = true;
    var greens = ['#d6e685', '#8cc665', '#44a340', '#1e6823'],
        random_green = greens[Math.floor(Math.random() * greens.length)];
    this.svg_el_reference.setAttribute('fill', random_green);
  };

  Cell.prototype.set_dead = function() {
    this.alive = false;
    this.svg_el_reference.setAttribute('fill', '#ebedf0');
  };

  Cell.prototype.apply_life_rules = function() {
    if (this.living_neighbors_count < 2)
      this.set_dead();
    else if (this.alive && (this.living_neighbors_count === 2 || this.living_neighbors_count === 3))
      this.set_alive();
    else if (this.living_neighbors_count > 3)
      this.set_dead();
    else if (this.living_neighbors_count === 3)
      this.set_alive();
  };
})();
