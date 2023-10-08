import axios from 'axios';

const apiKey = '39862305-3eae03d438ad95f2b3e72075a';
const pageUrl = 'https://pixabay.com/api/';

export const fetchGallery = async (query, page, perPage) => {
  try {
    const response = await axios.get(pageUrl, {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
