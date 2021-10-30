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
        maxChecks: 5,
        twilio:{
            fromMobileNo: '+14422338033',
            accountSid:'ACe1ae3ddcc011586e9fa06872765514a3',
            authToken:'beea714fbcc69ac4573ffa1281739c48'
        }
    },
    production: {
        port: 5000,
        envName: 'Production',
        secretKey:"MyProductionSecretKey",
        tokenLength: 20,
        maxChecks: 5,
        twilio:{
            fromMobileNo: '+14422338033',
            accountSid:'ACe1ae3ddcc011586e9fa06872765514a3',
            authToken:'beea714fbcc69ac4573ffa1281739c48'
        }
    }
}

const appConfig = environments[process.env.NODE_ENV ? process.env.NODE_ENV : 'staging'];

module.exports = appConfig;
