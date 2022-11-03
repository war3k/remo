function getApiUrl() {
  switch (process.env.REACT_APP_ENV) {
    case 'prod':
      return 'https://api.awizor.pl/v1';
    case 'stage':
      return 'https://api.remondis.maio.sh/v1';
    case 'test':
    default:
      return 'https://api.awizor.test.maio.sh/v1';
  }
}

export const API_URL = getApiUrl();
