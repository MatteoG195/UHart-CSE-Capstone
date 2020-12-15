var vertexShaderText =
    [
        'precision mediump float;',
        '',
        'attribute vec2 vertPosition;',
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        '',
        'void main()',
        '{',
        '  fragColor = vertColor;',
        '  gl_Position = vec4(vertPosition, 0.0, 1.0);',
        '}'
    ].join('\n');

var fragmentShaderText =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        '  gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n');

var Demo;
var buttontobutton = function (gl) {
    this.gl = gl;
    var me =this;
    me.PressedKeys = {
        Up: false,
        Right: false,
        Down: false,
        Left: false,
    };
    //this works
};

var triangleVertices = [ // X, Y,       R, G, B
    0.0, 0.0,    1.0, 0.05, 0.25,
    0.0, 0.5,  1.0, 0.75, 0.5,
    0.5, 0.5,   0.1, 1.0, 0.6,
    0.5, 0.0,   0.5, 0.6, 1.0,

];
var InitDemo = function () {
    console.log('This is working');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');



    gl.clearColor(.5, .5, .5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    //
    // Create buffer
    //
    Demo = new buttontobutton(gl);
    Demo.Begin(gl,program);
};

function AddEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
}

buttontobutton.prototype.Begin = function (gl,program) {
    //
    // Main render loop
    //
    var me= this;

    // Attach event listeners
    AddEvent(window, 'keydown', this._OnKeyDown.bind(this));
    AddEvent(window, 'keyup', this._OnKeyUp.bind(this));

    // Render Loop
    var loop = function () {
        me._Update();//(dt)

        var triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        console.log('This is working');
        me.nextFrameHandle = requestAnimationFrame(loop);
        //loop();
    };
    me.nextFrameHandle = requestAnimationFrame(loop);
    //loop();
};

buttontobutton.prototype._Update = function () {//(dt)
    if (this.PressedKeys.Forward && !this.PressedKeys.Back) {
        triangleVertices[1]+=0.0005;
        triangleVertices[6]+=0.0005;
        triangleVertices[11]+=0.0005;
        triangleVertices[16]+=0.0005;
    }

    if (this.PressedKeys.Back && !this.PressedKeys.Forward) {
        triangleVertices[1]-=0.0005;
        triangleVertices[6]-=0.0005;
        triangleVertices[11]-=0.0005;
        triangleVertices[16]-=0.0005;
    }

    if (this.PressedKeys.Right && !this.PressedKeys.Left) {
        triangleVertices[0]+=0.0005;
        triangleVertices[5]+=0.0005;
        triangleVertices[10]+=0.0005;
        triangleVertices[15]+=0.0005;
    }

    if (this.PressedKeys.Left && !this.PressedKeys.Right) {
        triangleVertices[0]-=0.0005;
        triangleVertices[5]-=0.0005;
        triangleVertices[10]-=0.0005;
        triangleVertices[15]-=0.0005;
    }
};

buttontobutton.prototype._OnKeyDown = function (e) {
    switch(e.code) {
        case 'KeyW':
            this.PressedKeys.Forward = true;
            break;
        case 'KeyA':
            this.PressedKeys.Left = true;
            break;
        case 'KeyD':
            this.PressedKeys.Right = true;
            break;
        case 'KeyS':
            this.PressedKeys.Back = true;
            break;
    }
};

buttontobutton.prototype._OnKeyUp = function (e) {
    switch(e.code) {
        case 'KeyW':
            this.PressedKeys.Forward = false;
            break;
        case 'KeyA':
            this.PressedKeys.Left = false;
            break;
        case 'KeyD':
            this.PressedKeys.Right = false;
            break;
        case 'KeyS':
            this.PressedKeys.Back = false;
            break;
    }
};