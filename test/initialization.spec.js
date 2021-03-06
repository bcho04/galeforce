const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const process = require('process');

chai.use(chaiAsPromised);
const { expect } = chai;

const GaleforceModule = require('../dist');

process.env.RIOT_KEY = 'RIOT-API-KEY-2';
process.env.CACHE_TYPE = 'internal';
process.env.REDIS_URL = '';

describe('/galeforce', () => {
    it('should initialize properly from config object (1)', () => {
        expect(() => new GaleforceModule({
            'riot-api': {
                key: 'RIOT-API-KEY',
            },
            'rate-limit': {
                type: 'bottleneck',
                options: {
                    intervals: {
                        120: 100,
                        1: 20,
                    },
                    'min-time': 50,
                },
            },
        })).to.not.throw();
    });
    it('should initialize properly from config object (2)', () => {
        expect(() => new GaleforceModule({
            'riot-api': {
                key: 'RIOT-API-KEY',
            },
            'rate-limit': {
                cache: {
                    type: 'redis',
                    'key-id': 'riotapi-ratelimit',
                    uri: '',
                },
            },
        })).to.not.throw();
    });
    it('should initialize properly from config object (3)', () => {
        expect(() => new GaleforceModule({
            'riot-api': {
                key: 'RIOT-API-KEY',
            },
            'rate-limit': {
                type: 'bottleneck',
                options: {
                    intervals: {
                        120: 100,
                        1: 20,
                    },
                },
                cache: {
                    type: 'redis',
                    'key-id': 'riotapi-ratelimit',
                    uri: 'redis://127.0.0.1:6379',
                },
            },
        })).to.not.throw();
    });
    it('should initialize properly from config object (4)', () => {
        expect(() => new GaleforceModule({
            'riot-api': {
                key: 'RIOT-API-KEY',
            },
            'rate-limit': {
                type: 'bottleneck',
                options: {
                    intervals: {
                        120: 100,
                        1: 20,
                    },
                },
            },
            debug: ['*'],
        })).to.not.throw();
    });
    it('should initialize properly from config file', () => {
        expect(() => new GaleforceModule('./test/test-configs/4.yaml')).to.not.throw();
    });
    it('should initialize properly from config file with environment variables', () => {
        expect(() => new GaleforceModule('./test/test-configs/2.yaml')).to.not.throw();
    });
    it('should initialize properly without being passed a config', () => {
        expect(() => new GaleforceModule()).to.not.throw();
    });
    it('should throw when the provided config fails JSON schema validation', () => {
        expect(() => new GaleforceModule({
            'rate-limit': {
                type: 'invalid',
            },
        })).to.throw('[galeforce]: Invalid config provided (config failed JSON schema validation).');
    });
    it('should throw when cache URI is required but not provided', () => {
        expect(() => new GaleforceModule({
            'rate-limit': {
                cache: {
                    type: 'redis',
                },
            },
        })).to.throw();
    });
    it('should have property region', () => {
        expect(new GaleforceModule()).to.have.property('region');
    });
});