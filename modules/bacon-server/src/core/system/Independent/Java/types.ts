export const VersionMeta = {
    '8': {
        first: '8u312',
        last: 'b07',
        dirname: 'jdk8u312-b07-jre',
    },
    '11': {
        first: '11.0.13',
        last: '8',
        dirname: 'jdk-11.0.13+8-jre',
    },
    '17': {
        first: '17.0.1',
        last: '12',
        dirname: 'jdk-17.0.1+12-jre',
    },
} as const

export type JavaVersion = keyof typeof VersionMeta

export enum JreDownloadLinks {
    _8_LINUX_x64 = 'https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u312-b07/OpenJDK8U-jre_x64_linux_hotspot_8u312b07.tar.gz',
    _8_WIN_x64 = 'https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u312-b07/OpenJDK8U-jre_x64_windows_hotspot_8u312b07.zip',
    _8_WIN_x86 = 'https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u312-b07/OpenJDK8U-jre_x86-32_windows_hotspot_8u312b07.zip',
    _8_MAC_x64 = 'https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u312-b07/OpenJDK8U-jre_x64_mac_hotspot_8u312b07.tar.gz',

    _11_LINUX_x64 = 'https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.13+8/OpenJDK11U-jre_x64_linux_hotspot_11.0.13_8.tar.gz',
    _11_WIN_x64 = 'https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.13+8/OpenJDK11U-jre_x64_windows_hotspot_11.0.13_8.zip',
    _11_WIN_x86 = 'https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.13+8/OpenJDK11U-jre_x86-32_windows_hotspot_11.0.13_8.zip',
    _11_MAC_x64 = 'https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.13+8/OpenJDK11U-jre_x64_mac_hotspot_11.0.13_8.tar.gz',

    _17_LINUX_x64 = 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.1+12/OpenJDK17U-jre_x64_linux_hotspot_17.0.1_12.tar.gz',
    _17_WIN_x64 = 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.1+12/OpenJDK17U-jre_x64_windows_hotspot_17.0.1_12.zip',
    _17_WIN_x86 = 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.1+12/OpenJDK17U-jre_x86-32_windows_hotspot_17.0.1_12.zip',
    _17_MAC_x64 = 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.1+12/OpenJDK17U-jre_x64_mac_hotspot_17.0.1_12.tar.gz',
}

export const JreSHA256: {
    [key in JavaVersion]: Partial<{
        [key in typeof process.platform]: {
            [key in typeof process.arch]?: string
        }
    }>
} = {
    '8': {
        win32: {
            x64: '1da3bd122e496836fe43b860f64a479f1b9a3aeb94d592bba0dc7b9af450e79c',
            x86: 'a4623365d70e7bc969e84b7f29b6b2eecb6c0686863ed67651506e2b5adf43b0',
        },
        linux: {
            x64: '18fd13e77621f712326bfcf79c3e3cc08c880e3e4b8f63a1e5da619f3054b063',
        },
        darwin: {
            x64: 'c8cf94118bd073c3caf0cde2389993ef7f482b46daa7b6f6d680f90d6de1dd3d',
        },
    },
    '11': {
        win32: {
            x64: '7b0c07a068506b8539408cfe60e3120f54610af463a2dbd3b2ca42b572dd567e',
            x86: '60ed46fd2072d2ab25333a367b0ed58f8cf6441b877628f2324273a6b5c71222',
        },
        linux: {
            x64: 'fb0a27e6e1f26a1ee79daa92e4cfe3ec0d676acfe114d99dd84b3414f056e8a0',
        },
        darwin: {
            x64: 'b175876c6f940ff3c8e1053a668516d2987cd6b3c5661dcc7ad8787379846d15',
        },
    },
    '17': {
        win32: {
            x64: '14e36001bddb80379afb993e54366385e4d9a9daaee1117bf857f3840c53ddbc',
            x86: 'f4bb1323cb34cdb42b92d825fe36fddd78b274f071b8971c5207a66a0e82748a',
        },
        linux: {
            x64: '9d58cb741509a88e0ae33eb022334fb900b409b198eca6fe76246f0677b392ad',
        },
        darwin: {
            x64: 'd7eefa08d893d1ae263dc4ba427baa67b3cb9d48e1151654e423007fb2801358',
        },
    },
}

