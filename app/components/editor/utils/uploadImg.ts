//* Some sort of chimin code here, have no idea where to plug it

import axios from 'axios';

function uploadImage(file: File) {
  const data = new FormData(); 
  data.append('file', file);
  return axios.post('/api/upload', data);
};

uploadImage(file).then(function(response : string) {
  let image = new Image();
  image.src = response;
  image.onload = function() {
    const { schema } = view.state;
    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
    const node = schema.nodes.image.create({ src: response });
    const transaction = view.state.tr.insert(coordinates.pos, node);
    return view.dispatch(transaction);
  }
}).catch(function(error : Error) {
  if (error) {
    window.alert("There was a problem uploading your image, please try again.");
  }
});