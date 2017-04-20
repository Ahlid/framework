//Class Point


Point = (function(){

    var x;
    var y;
    
    return function (x,y){
        
        this.onXChange = function(newVal){
            
        }
        this.onYChange = function(newVal){
            
        }
        
        Object.defineProperty(this, 'x', {
            enumerable : true,
            configurable : false,
            get : function() {
                return x;
            },
            set : function(newValue) {
                
                if(x !== newValue){
                    x = newValue;
                    this.onXChange(newValue);
                }
 
            } 
        });
        
        Object.defineProperty(this, 'y', {
            enumerable : true,
            configurable : false,
            get : function() {
                return y;
            },
            set : function(newValue) {
                
                if(y !== newValue){
                    y = newValue;
                    this.onYChange(newValue);
                }
                
            } 
        });
        
    }
    
})();

function CubicLine(){
    var svgNS = 'http://www.w3.org/2000/svg';
    
    this.element = document.createElementNS(svgNS,'path');
    this.element.setAttributeNS(null, 'class','flow-cubic-line');
    
    this.current = [
        0, 0, //start point
        0, 0, //end point
        0, 0, //controlA point
        0, 0  //controlB point
    ];
    
    this.start = new Point(0,0);
    this.end = new Point(0,0);
    this.controlA = new Point(0,0);
    this.controlB = new Point(0,0);
 
    var object = this;
    
    this.start.onXChange = function(newValue) {
        object.changeValue(0,newValue);
    }
    
    this.start.onYChange = function(newValue) {
        object.changeValue(1,newValue);
    }
    
    this.end.onXChange = function(newValue) {
        object.changeValue(2,newValue);
    }
    
    this.end.onYChange = function(newValue) {
        object.changeValue(3,newValue);
    }
    
    this.controlA.onXChange = function(newValue) {
        object.changeValue(4,newValue);
    }
    
    this.controlA.onYChange = function(newValue) {
        object.changeValue(5,newValue);
    }
    
    this.controlB.onXChange = function(newValue) {
        object.changeValue(6,newValue);
    }
    
    this.controlB.onYChange = function(newValue) {
        object.changeValue(7,newValue);
    }

}

CubicLine.prototype.update = function(){
        
    var result = 'M' + this.current[0] + ' ' + this.current[1];
    result += ' C ' + this.current[4] + ' ' + this.current[5] + ' , ';
    result += this.current[6] + ' ' + this.current[7] + ' , ';
    result += this.current[2] + ' ' + this.current[3];
    this.element.setAttribute('d',result);
        
}

CubicLine.prototype.changeValue = function(index,newValue) {
    this.current[index] = newValue;
    this.update();
}


//UTILITY
function makeDraggable(dragAreaElement,dragElement){
    
    /* Handle dragging */
    var valueX = 0;
    var valueY = 0;
    
    function move(e){

        var viewportOffset = dragElement.parentNode.getBoundingClientRect();
        var top = viewportOffset.top;
        var left = viewportOffset.left;     
        
        var x = e.pageX - left - valueX;
        var y = e.pageY - top - valueY;
        
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;

        
        x = x > dragElement.parentNode.offsetWidth  - dragElement.offsetWidth  ? dragElement.parentNode.offsetWidth  - dragElement.offsetWidth  : x;
        y = y > dragElement.parentNode.offsetHeight - dragElement.offsetHeight ? dragElement.parentNode.offsetHeight - dragElement.offsetHeight : y;
        
        dragElement.style.left = x + 'px';
        dragElement.style.top = y + 'px';

 
        var event = new CustomEvent("dragged", { 
            "detail": "Element dragged",
            'pageX' : e.pageX,
            'pageY' : e.pageY
        });
        dragElement.dispatchEvent(event);
        
    }
    
    function mouseUp(e){
        window.removeEventListener('mousemove', move, true);
        var classe = document.body.getAttribute('class');
        classe = classe.replace(' disable-select', '');
        document.body.setAttribute('class', classe);
    }
    
    function mouseDown(e){
        
        
        var classe = document.body.getAttribute('class') || '';
        
        document.body.setAttribute('class', classe + ' disable-select');
        
        var viewportOffset = dragElement.getBoundingClientRect();
        var top = viewportOffset.top;
        var left = viewportOffset.left;
        
        valueX = event.pageX - left;
        valueY = event.pageY - top;
        window.addEventListener('mousemove', move, true);
    }
    
    dragAreaElement.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    
}


function FlowCanvas(width,height){
    
    var svgNS = 'http://www.w3.org/2000/svg';
    
    this.element = document.createElement('div');
    this.element.setAttribute('class','flow-canvas');
  //  this.element.style.width = width + 'px';
    //this.element.style.height = height + 'px';

    this.svgCanvas = document.createElementNS(svgNS ,'svg');
    this.svgCanvas.setAttributeNS(null,'class','flow-canvas-svg');
    
    this.element.appendChild(this.svgCanvas);
    
}

FlowCanvas.prototype.getElementOffset = function(element){
    
    var elementViewportOffset = element.getBoundingClientRect();
    var flowCanvasViewportOffset = this.element.getBoundingClientRect();
    
    return {
        'x': elementViewportOffset.left - flowCanvasViewportOffset.left,
        'y': elementViewportOffset.top - flowCanvasViewportOffset.top
    }
    
}


FlowCanvas.prototype.getViewportPointOffset = function(viewportPointX, viewportPointY){
    
    var flowCanvasViewportOffset = this.element.getBoundingClientRect();
    
    return {
        'x': viewportPointX - flowCanvasViewportOffset.left,
        'y': viewportPointY - flowCanvasViewportOffset.top
    }
    
}


FlowCanvas.prototype.addFlowObject = function(flowObject){
    if(flowObject !== void 0 && flowObject instanceof FlowObject)
        this.element.appendChild(flowObject.element);
}

//Receive the flow object in order to update position changes to the sockets connection
function FlowSocket(flowCanvas){
    
    
    this.circleSize = 16;
    this.borderThickness = 2;
    
    var svgNS = 'http://www.w3.org/2000/svg';
    
    this.element = document.createElementNS(svgNS ,'svg');
    this.element.setAttributeNS(null,'class','flow-socket-svg');
    this.flowCanvas = flowCanvas;

    
    this.circle = document.createElementNS(svgNS ,'circle');
    this.element.appendChild(this.circle);
    this.circle.setAttributeNS(null,'class','flow-socket-circle');
    this.circle.setAttributeNS(null,'cx',this.circleSize/2);
    this.circle.setAttributeNS(null,'cy',this.circleSize/2);
    this.circle.setAttributeNS(null,'r',this.circleSize/2 - this.borderThickness);
    


}

FlowSocket.prototype.setFlowObject = function(flowObject){
    
    if(this.flowObject){
        
        //TODO: Procedure to detach old flowObject
        
        
    }
    
    this.flowObject = flowObject;

    (function(socket,socketSize,element,circle,flowCanvas){
        
        var socketHalfSize = socketSize / 2;
        
        function move(e){
            
            var offset = flowCanvas.getViewportPointOffset(e.pageX, e.pageY); 
            
            var x = offset.x + socketHalfSize;
            var y = offset.y + socketHalfSize;
            
            flowCanvas.connection.line.end.x = x;
            flowCanvas.connection.line.end.y = y;
            flowCanvas.connection.line.controlB.x = x + 40;
            flowCanvas.connection.line.controlB.y = y;
            
        }
        
        function mouseUp(e){

            window.removeEventListener('mousemove', move, true);
            window.removeEventListener('mouseup', mouseUp, false);
            
            if(flowCanvas.connection === void 0)
                console.log('Something went wrong when dragging from a socket.');
            
            if(flowCanvas.connection.done){
                
                var updateConnectionEndPoint = (function(flowCanvas, connectionLine){
                    
                    return function(){
                        
                        var offset = flowCanvas.getElementOffset(element);
                        var x = offset.x + socketHalfSize;
                        var y = offset.y + socketHalfSize;
                        
                        // TODO: define controlA
                        connectionLine.start.x = x;
                        connectionLine.start.y = y;
                        connectionLine.controlA.x = x - 40;
                        connectionLine.controlA.y = y
                        
                    }
                    
                })(flowCanvas,flowCanvas.connection.line);
                
                updateConnectionEndPoint();
                socket.flowObject.element.addEventListener("dragged", updateConnectionEndPoint);
                
            } else {
                
                flowCanvas.svgCanvas.removeChild(flowCanvas.connection.line.element);
                circle.setAttributeNS(null,'class','flow-socket-circle');
                
            }
            
            delete flowCanvas.connection;

        }
        
        function socketMouseDown(e){

            circle.setAttributeNS(null,'class','flow-socket-circle-action');

            var socketViewportOffset = element.getBoundingClientRect();
            var socketOffset = flowCanvas.getViewportPointOffset(socketViewportOffset.left, socketViewportOffset.top);
            var cursorOffset = flowCanvas.getViewportPointOffset(e.pageX, e.pageY);
            
            var x = socketOffset.x + socketHalfSize;
            var y = socketOffset.y + socketHalfSize;
            
            var line = new CubicLine();
            flowCanvas.svgCanvas.appendChild(line.element);
            
            // TODO: define controlA and controlB
            line.start.x = x;
            line.start.y = y;
            line.controlA.x = x - 40;
            line.controlA.y = y;
            line.end.x = x;
            line.end.y = y;
            line.controlB.x = x - 40;
            line.controlB.y = y;
            

            flowCanvas.connection = {
                'line' : line,
                'socket' : socket
            };
            
            window.addEventListener('mousemove', move, true);
            window.addEventListener('mouseup', mouseUp, false);
            
        }
        
        function socketMouseUp(e){
            
            if(flowCanvas.connection !== void 0){
                
                flowCanvas.connection.done = true;
                circle.setAttributeNS(null,'class','flow-socket-circle-connected');
                flowCanvas.connection.socket.circle.setAttributeNS(null,'class','flow-socket-circle-connected');
                flowCanvas.connection.line.element.setAttributeNS(null,'class','flow-socket-connection');
                
                var updateConnectionEndPoint = (function(flowCanvas, connectionLine){
                    
                    return function(){
                        
                        var offset = flowCanvas.getElementOffset(element);
                        var x = offset.x + socketHalfSize;
                        var y = offset.y + socketHalfSize;
                        
                        // TODO: define controlB
                        connectionLine.end.x = x;
                        connectionLine.end.y = y;
                        connectionLine.controlB.x = x - 40;
                        connectionLine.controlB.y = y;
                        
                    }
                    
                })(flowCanvas,flowCanvas.connection.line);
                
                flowObject.element.addEventListener("dragged", updateConnectionEndPoint);
                updateConnectionEndPoint();
                
               
            }

        }
        
        function socketMouseOver(e){
            
            if(flowCanvas.connection !== void 0 && flowCanvas.connection.socket !== socket){
                var classAttribute = circle.getAttribute('class');
                if(circle.getAttribute('class') != 'flow-socket-circle-action' &&
                    classAttribute != 'flow-socket-circle-connected')
                    circle.setAttributeNS(null,'class','flow-socket-circle-action');
            }
            
        }
        
        function socketMouseOut(e){
            
            if(flowCanvas.connection !== void 0 && flowCanvas.connection.socket != socket){ 
                var classAttribute = circle.getAttribute('class');
                if(circle.getAttribute('class') != 'flow-socket-circle' &&
                    classAttribute != 'flow-socket-circle-connected')
                    circle.setAttributeNS(null,'class','flow-socket-circle');
            }
            
        }
        
        element.addEventListener('mousedown', socketMouseDown, false);
        element.addEventListener('mouseup', socketMouseUp, false);
        element.addEventListener('mouseover', socketMouseOver, true);
        element.addEventListener('mouseout', socketMouseOut, true);
        
        
    })(this,this.circleSize,this.element,this.circle,this.flowCanvas);
}



function FlowObject(id,name){
    
    this.id = id;
    this.name = name;
    
    this.element = document.createElement('div');
    this.element.setAttribute('id', id);
    this.element.setAttribute('class','flow-object');
    
    this.draggableArea = document.createElement('div');
    this.draggableArea.setAttribute('class','flow-object-draggable-area');
    
    this.title = document.createElement('h1');
    this.title.setAttribute('class','flow-object-title');
    this.title.appendChild(document.createTextNode(name));

    
    makeDraggable(this.draggableArea,this.element);
    this.element.appendChild(this.draggableArea);
    this.draggableArea.appendChild(this.title);
    
}

