var messages = [];
function lol(){
  messages.push({id: 4, message: 'lol', parent: 1});
  buildTree(); 
}

function buildTree() {
  content.innerHTML = "";
  var messageMap = messages.reduce(function(map, node) {
    map[node.id] = node;
    return map;
  }, {});

  var treeData = [];

  messages.forEach(function(node) {
    //add to parent
    var parent = messageMap[node.parent];
    if (parent) {
      (parent.children || (parent.children = []))
        .push(node);
    } 
    else {
      treeData.push(node);
    }

  });

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;

  var i = 0;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  var svg = d3.select("#content").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +")");

  var root = treeData[0]

  update(root);

  function update(source) {
    nodes = tree.nodes(root).reverse();
    links = tree.links(nodes);

    nodes.forEach(function(d) { 
      d.y = d.depth * 180;
    });

    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i);});


    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.y +","+ d.x +")";
      });

    nodeEnter.append("circle")
      .attr("r", 50)
      .style("fill", "#fff");

    nodeEnter.append("text")
      .attr("x", function(d) {
        return -10;
      })
      .attr("dy", 0)
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.username + ":" + d.message})
      .style("fill-opacity", 1)
      svg.selectAll('g.node').on('click', function(n){
        $("#parent")[0].value = n.id; 
      });

      var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id;});

      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);
  }  
}
