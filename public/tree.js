function buildTree(messages, activeMessage) {
  content.innerHTML = "";

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left,
      height = 600 - margin.top - margin.bottom,
      r = 300;

  var tree = d3.layout.tree()
    .size([360, r])
    .separation(separation)
    .sort(function(a, b){
      return b.id - a.id;
    });


  var svg = d3.select("#content").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .style("float", "left")
    .append("g")
    .attr("transform", "translate(" + (r*1.5) + "," + (r) + ")");

  var messageArea = d3.select("#content").append("div")
    .style("float", "left")
    .style("width", "300px")
    .style("margin-top", "100px")
    .style('max-width', '300px')
    .attr('class', 'messageArea');


  messageArea
    .append('p')
    .attr('class', 'username')
    .attr('color', 'black');
  messageArea
    .append('p')
    .attr('class', 'message')
    .attr('color', 'black');


  var colors = d3.scale.category20();
  var messageColor = function(d){
    return d.username;
  }
  var source = messages[0];
  update(source);

  function update(root) {
    var nodes = tree.nodes(root);
    var links = tree.links(nodes);

    var link = svg.selectAll(".link")
      .data(links, function(d){return d.source.id + "-" + d.target.id});

    var linkEnter = link
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "black")
      .style("stroke-opacity", 1)
      .style("stroke-width", function(d) { return 1 })
      .attr("x1", function(d){return rtc(d.source, true).x})
      .attr("y1", function(d){return rtc(d.source, true).y})
      .attr("x2", function(d){return rtc(d.source, true).x})
      .attr("y2", function(d){return rtc(d.source, true).y})

    var node = svg.selectAll(".node")
      .data(nodes, function(d){return d.id})
      //keeps them above the links
      .each(function(){ this.parentNode.appendChild(this);});

    var nodeEnter = node
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", function(d) {return (50/(1 + d.depth))})
      .attr("fill", function(d){return colors(messageColor(d))})
      .attr("stroke", "black")
      .attr("transform", function(d) { return "rotate(" + (d.parent && d.parent.x0? d.parent.x0 - 90:0) + ")translate(" + (d.parent && d.parent.y0? d.parent.y0:0) + ")"})
      .on("mouseover", function(d){
        messageArea
          .style('background', colors(messageColor(d)));
        messageArea.select('p.username')
          .text("user: " + d.username);
        messageArea.select('p.message')
          .text("message: " + d.message);
      })
      .on("click", function(d){
        if(activeMessage.el){
          activeMessage.el.attr("stroke", "black");
        }
        activeMessage.message = d;
        activeMessage.el = $(this);
        $(this).attr("stroke", "red");
      });

    transitionLinks(link);
    transitionNodes(node);
    
    //set this for the transitions later
    nodes.forEach(function(n){
      n.x0 = n.x;
      n.y0 = n.y;
    });
  }
  return update;
}

function radialToCartesian(d, usex0){
  if(!d.x){
    d.x = 90;
  }
  if(!d.x0){
    d.x0 = 90;
  }
  var r = d.y;
  var theta = d.x;
  if(usex0){
    r = d.y0;
    theta = d.x0;
  }
  theta= (theta - 90) / 180 * Math.PI;
  return {x: r*Math.cos(theta), y: r*Math.sin(theta)};
}
var rtc = radialToCartesian;

function separation(a, b) {
  return (a.parent == b.parent ? .5 : 1) / a.depth;
}

function transitionLinks(link){
  link.transition()
      .duration(700)
      .attr("x1", function(d) { return rtc(d.source).x; })
      .attr("y1", function(d) { return rtc(d.source).y; })
      .attr("x2", function(d) { return rtc(d.target).x; })
      .attr("y2", function(d) { return rtc(d.target).y; });
}

function transitionNodes(node){
  node.transition()
      .duration(700)
      .attr("transform", function(d) { return "rotate(" + (d.x? d.x-90 :0) + ")translate(" + d.y + ")"}); 
}
