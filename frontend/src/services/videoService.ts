
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos';

const uploadVideo = (formData: FormData, token: string) => {
  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
};

export default { uploadVideo };
