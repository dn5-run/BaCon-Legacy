export const VersionMeta = {
    '8': {
        first: '8u322',
        last: 'b06',
        dirname: 'jdk8u322-b06-jre',
    },
    '11': {
        first: '11.0.14',
        last: '9',
        dirname: 'jdk-11.0.14+9-jre',
    },
    '17': {
        first: '17.0.2',
        last: '8',
        dirname: 'jdk-17.0.2+8-jre',
    },
} as const

export type JavaVersion = keyof typeof VersionMeta

export const JreSHA256: {
    [key in JavaVersion]: Partial<{
        [key in typeof process.platform]: {
            [key in typeof process.arch]?: string
        }
    }>
} = {
    '8': {
        win32: {
            x64: 'd270fc127296784307d76052d7acbd65c7e5dbf48c1cbdddabe3923c56ec60a0',
        },
        linux: {
            x64: '9c4607cee01919a21c57a36e8c009a7aca7aefd63010c64d7a3023fe8590ebe1',
        },
        darwin: {
            x64: '42d4ada88e39b0f222ffdcf3c833f442af22852687992997eca82c573e65b86f',
        },
    },
    '11': {
        win32: {
            x64: 'd8993b00db75a69c6ea4778b6c79d26a1297cbbb14ab02765e102e0ce79c2653',
        },
        linux: {
            x64: 'f9c0b0c5f379f57424a1cb9fb304003aeb827817d8b12164388792e145011480',
        },
        darwin: {
            x64: 'cc1cb6f2ce4414b2c5760829b2cee38b935f6a5e891f4dc2b2a8df799ff2477b',
        },
    },
    '17': {
        win32: {
            x64: 'c3204a19aede95ed02ad0f427210855a951d845ab7f806fb56b774daf2572454',
        },
        linux: {
            x64: '292ed702d95f5690e52e171afe9f3050b9d2fb803456b155c831735fad0f17c0',
        },
        darwin: {
            x64: '4e2e5e9c079ccc48b056959b2808a96398ebbc92d6b13ee5beb3159b89469aa8',
        },
    },
}
