(function() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  gl.clearColor(1, 1, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  document.querySelector('#file').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.addEventListener('load', console.log.bind(null, 'load'));
    reader.addEventListener('error', console.log.bind(null, 'error'));
    reader.addEventListener('abort', console.log.bind(null, 'abort'));
    reader.addEventListener('loadstart', console.log.bind(null, 'loadstart'));
    reader.addEventListener('loadend', () => {
      console.log(reader.result);
    });
    reader.readAsText(e.target.files[0]);
  });
})();