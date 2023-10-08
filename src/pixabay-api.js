import axios from 'axios';
const pageUrl = 'https://pixabay.com/api/';

export const fetchGallery = async (query, page, perPage) => {
  try {
    const response = await axios.get(pageUrl, {
      params: {
        key: '39920680-d88766f8733cbec968fb0f207',
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
