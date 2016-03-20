javascript:(function() {
  var svg = document.getElementsByClassName('js-calendar-graph-svg')[0],
      graph = svg.children[0],
      columns = [].filter.call(graph.children, function(node) { return node.tagName === 'g'; }),
      grid = create_grid_from_columns(columns);


  hide_edge_columns(columns);




  function create_grid_from_columns(svg_columns) {
    /* ignore first and last cols, since they might be different heights */
    return [].map.call(svg_columns.slice(1, svg_columns.length - 1), function(col) {
      return [].map.call(col.children, function(node) {
        var is_alive = node.getAttribute('fill') !== "#eeeeee";
        return new Cell(is_alive, node);
      });
    });
  }


  function hide_edge_columns(svg_columns) {
    [].forEach.call(svg_columns[0].children, color_white);
    [].forEach.call(svg_columns[svg_columns.length-1].children, color_white);
  }



  function color_white(svg_node) {
    svg_node.setAttribute('fill', '#ffffff');
  }


  function color_grey(svg_node) {
    svg_node.setAttribute('fill', '#eeeeee');
  }


  function color_random_green(svg_node) {
    var greens = ['#d6e685', '#8cc665', '#44a340', '#1e6823'],
        random_green = greens[Math.floor(Math.random() * greens.length)];
    svg_node.setAttribute('fill', random_green);
  }




  function Cell(alive, svg_el_reference) {
    this.alive = alive || false;
    this.svg_el_reference = svg_el_reference || null;
  }



  window.grid = grid;


})();
