(function() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  const VS_SOURCE = `
    attribute vec2 aPosition;

    void main() {
      gl_Position = vec4(aPosition, 0, 1);
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
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(reader.result), gl.STATIC_DRAW);
      render(buffer);
    });
    // reader.readAsText(e.target.files[0]);
    reader.readAsArrayBuffer(e.target.files[0]);
  });

  function render(buffer) {
    gl.clearColor(1, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function createShader(context, type, source) {
    const shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);
    // TODO compile check
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
})();