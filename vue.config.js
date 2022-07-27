module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? 'https://remy.ovh/json-to-php-generator/'
        : '/'
};
