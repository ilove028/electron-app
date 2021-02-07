(function() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  const VS_SOURCE = `
    attribute vec2 aPosition;
    uniform mat3 uRotateMatrix;
    uniform mat3 uTranslateMatrix;
    uniform mat3 uProjectMatrix;

    void main() {
      gl_Position = vec4(vec3(aPosition, 1) * uRotateMatrix * uTranslateMatrix * uProjectMatrix, 1);
    }
  `;
  const FS_SOURCE = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(0, 1, 1, 1);
    }
  `;
  const program = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, VS_SOURCE),
    createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE)
  );
  
  document.querySelector('#file').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.addEventListener('load', console.log.bind(null, 'load'));
    reader.addEventListener('error', console.log.bind(null, 'error'));
    reader.addEventListener('abort', console.log.bind(null, 'abort'));
    reader.addEventListener('loadstart', console.log.bind(null, 'loadstart'));
    reader.addEventListener('loadend', () => {
      // console.log(reader.result);
      const buffer = gl.createBuffer();
      let pre;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(reader.result), gl.STATIC_DRAW);
      function tick(current) {
        pre = pre || current;
        render(buffer, (current - pre) / 1000 * 180);
        requestAnimationFrame(tick);
      }

      tick()
    });
    // reader.readAsText(e.target.files[0]);
    reader.readAsArrayBuffer(e.target.files[0]);
  });

  function render(buffer, degree) {
    gl.clearColor(1, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    const uRotateMatrix = gl.getUniformLocation(program, 'uRotateMatrix');
    gl.uniformMatrix3fv(uRotateMatrix, false, rotate2D(degree));

    const uTranslateMatrix = gl.getUniformLocation(program, 'uTranslateMatrix');
    gl.uniformMatrix3fv(uTranslateMatrix, false, translate2D(canvas.clientWidth / 2, canvas.clientHeight / 2));

    const uProjectMatrix = gl.getUniformLocation(program, 'uProjectMatrix');
    gl.uniformMatrix3fv(uProjectMatrix, false, project(0, canvas.clientWidth, 0, canvas.clientHeight));

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function createShader(context, type, source) {
    const shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);
    // TODO compile check
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  function createProgram(context, vertexShader, fragmentShader) {
    const program = context.createProgram();
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    // program check
    return program;
  }

  function translate2D(x, y) {
    return [
      1, 0, x,
      0, 1, y,
      0, 0, 1
    ];
  }

  function rotate2D(degree) {
    const radian = degree / 180 * Math.PI;
    const cosine = Math.cos(radian);
    const sine = Math.sin(radian);
    return [cosine, -sine, 0, sine, cosine, 0, 0, 0, 1];
  }

  function project(left, right, top, bottom) {
    // return [
    //   2 / (right - left), 0 , -1,
    //   0, 2 / (bottom - top), -1,
    //   0, 0, 1
    // ];
    // 先进行Y轴翻转 在进行缩放为2 * 2 在平移到相应位置
    /**
     * [
     *  1, 0.  0.
     *  0. -1. 0.
     *  0. 0.  1
     * ] *
     * [
     *  2 / (r - l), 0,           0,
     *  0,           2 / (b - t), 0,
     *  0,           0,           1
     * ] *
     * [
     *  1,                   0,                   0,
     *  0,                   1,                   0,
     *  -1 - 2 * t / (r -l), 1 - 2 * l / (t - b), 1
     * ]
     */
    const width = right - left;
    const height = top - bottom;
    return [
      2 / width, 0, -1 - 2 * top / width,
      0, 2 / height, 1 - 2 * left / height,
      0, 0, 1 
    ]
  }

  function MVideo(selector) {
    this._el = document.querySelector(selector);
    document.addEventListener('click', () => {
      this.play();
    });
  }

  MVideo.prototype.play = function() {
    this._el.play();
  }

  new MVideo('video');
})();