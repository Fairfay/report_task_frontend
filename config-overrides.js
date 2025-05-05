const CompressionPlugin = require('compression-webpack-plugin');
// Переопределение Webpack-конфигурации
module.exports = function override(config, env) {
    // Включаем сжатие только в production-сборке
    if (env === 'production') {
        config.plugins.push(
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                minRatio: 0.8,
            })
        );
    }
    return config;
};