const axios = require('axios').default;

export default class ImagesApiService {
  constructor() {
    (this.searchQuery = ''), (this.page = 0);
  }
  async getImages() {
    try {
      const response = await axios.get('https://pixabay.com/api', {
        params: {
          key: '33981383-7f4227d9f376dfc0e6fd14470',
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: this.page,
          per_page: 40,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.page += 1;
      return response.data;
    } catch (error) {
      error.message;
    }
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
