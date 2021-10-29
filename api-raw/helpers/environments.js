/**
 * Author: Ashiqur Rahman
 * Descripion: Application configuration
 */

const environments = {
    staging: {
        port: 3000,
        envName: 'Staging',
        secretKey: 'MyStagingSecretKey',
        tokenLength: 20,
        maxChecks: 5
    },
    production: {
        port: 5000,
        envName: 'Production',
        secretKey:"MyProductionSecretKey",
        tokenLength: 20,
        maxChecks: 5
    }
}

const appConfig = environments[process.env.NODE_ENV ? process.env.NODE_ENV : 'staging'];

module.exports = appConfig;
