/**
 * Author: Ashiqur Rahman
 * Descripion: Application configuration
 */

const environments = {
    staging: {
        port: 3000,
        envName: 'Staging'
    },
    production: {
        port: 5000,
        envName: 'Production'
    }
}

const appConfig = environments[process.env.NODE_ENV ? process.env.NODE_ENV : 'staging'];

module.exports = appConfig;
