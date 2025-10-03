import axios from 'axios';

export const PER_PAGE = 15;

const API_KEY = '52465106-83256c19c806c121527b257ca';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: PER_PAGE,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data; // { totalHits, hits: [...] }
}