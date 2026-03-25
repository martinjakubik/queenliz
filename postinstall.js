import * as oFs from 'fs/promises';

const sLibSrcPath = './node_modules';
const sLibDestPath = './js/lib';

const sKierkiJsLibSrcPath = `${sLibSrcPath}/kierki/js`;
const aKierkiJsLibSrcList = [
    'GamePlay.js',
    'GameSession.js',
    'Player.js',
    'Tools.js',
];

const sKierkiCssLibSrcPath = `${sLibSrcPath}/kierki/css`;
const aKierkiCssLibSrcList = ['screen.css'];

const sKierkiResourceLibSrcPath = `${sLibSrcPath}/kierki/resources`;
const aKierkiResourceLibSrcList = ['cardshwip.wav'];

const sKierkiJsLibDestPath = `${sLibDestPath}/kierki/js`;
const sKierkiCssLibDestPath = `${sLibDestPath}/kierki/css`;
const sKierkiResourceLibDestPath = `${sLibDestPath}/kierki/resources`;

const oMkDirOptions = {
    recursive: true,
};

oFs.mkdir(sKierkiJsLibDestPath, oMkDirOptions)
    .then((oResult) => {
        console.log(oResult);

        aKierkiJsLibSrcList.forEach((sElement) => {
            const sSourceFile = `${sKierkiJsLibSrcPath}/${sElement}`;
            const sDestFile = `${sKierkiJsLibDestPath}/${sElement}`;
            oFs.copyFile(sSourceFile, sDestFile)
                .then((oResult) => {
                    console.log(oResult);
                })
                .catch((oError) => {
                    console.log(oError);
                });
        });
    })
    .catch((oError) => {
        console.log(oError);
    });

oFs.mkdir(sKierkiCssLibDestPath, oMkDirOptions)
    .then((oResult) => {
        console.log(oResult);

        aKierkiCssLibSrcList.forEach((sElement) => {
            const sSourceFile = `${sKierkiCssLibSrcPath}/${sElement}`;
            const sDestFile = `${sKierkiCssLibDestPath}/${sElement}`;
            oFs.copyFile(sSourceFile, sDestFile)
                .then((oResult) => {
                    console.log(oResult);
                })
                .catch((oError) => {
                    console.log(oError);
                });
        });
    })
    .catch((oError) => {
        console.log(oError);
    });

oFs.mkdir(sKierkiResourceLibDestPath, oMkDirOptions)
    .then((oResult) => {
        console.log(oResult);

        aKierkiResourceLibSrcList.forEach((sElement) => {
            const sSourceFile = `${sKierkiResourceLibSrcPath}/${sElement}`;
            const sDestFile = `${sKierkiResourceLibDestPath}/${sElement}`;
            oFs.copyFile(sSourceFile, sDestFile)
                .then((oResult) => {
                    console.log(oResult);
                })
                .catch((oError) => {
                    console.log(oError);
                });
        });
    })
    .catch((oError) => {
        console.log(oError);
    });
