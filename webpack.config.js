const webpack = require('webpack');
const path = require('path');

function getPlugin() {
    if(process.env.NODE_ENV === 'production') {
       return [
            new webpack.optimize.UglifyJsPlugin()
        ];
    } else {
        return [

        ];
    }
}

config = {
    entry: {
        main: ['./_typescript/main.ts']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './js/')
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions:['.ts', '.tsx', '.js'],
        alias: {

        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    plugins: getPlugin()
};

module.exports = config;
