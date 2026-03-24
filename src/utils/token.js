const TEST_TOKEN = 'mock-token-test-user';

function getTokenFromHeader(authorization = '') {
  if (!authorization.startsWith('Bearer ')) {
    return '';
  }

  return authorization.slice(7).trim();
}

module.exports = {
  TEST_TOKEN,
  getTokenFromHeader,
};
