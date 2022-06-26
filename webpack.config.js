modules.exports = {
    module: {
        rules: [
            {
                test: /\.(glb|gltf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/models/',
                        },
                    },
                ],
            },
        ],
    },
}
