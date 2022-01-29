    import webpack from 'webpack'
    import HtmlWebpackPlugin from 'html-webpack-plugin'
    import path from 'path'

    const config: webpack.Configuration = {
        name: 'renderer',
        target: 'web',
        context: path.resolve(__dirname),
        entry: ['./src'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx$|\.ts$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: false,
            }),
        ],
        devtool: 'source-map',
    }

    export default config
