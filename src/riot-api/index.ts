import _ from 'lodash';
import https from 'https';
import fs from 'fs';
import path from 'path';
import debug from 'debug';
import chalk from 'chalk';
import * as ENDPOINTS from './enums/endpoints';
import {
    Region, LeagueRegion, RiotRegion, ValorantRegion, DataDragonRegion, LorRegion,
} from './enums/regions';
import { Queue, LeagueQueue, ValorantQueue } from './enums/queues';
import Tier from './enums/tiers';
import Division from './enums/divisions';
import Game from './enums/games';
import Request from './requests';
import { ConfigInterface } from '../galeforce/interfaces/config';

const initDebug = debug('galeforce:init');

initDebug(`${chalk.bold('attempting to load Game Client certificate chain')}`);

const httpsAgent = (fs?.readFileSync) ? new https.Agent({ ca: fs.readFileSync(path.join(__dirname, '..', '..', 'resource', 'riotgames.pem')) }) : new https.Agent();

export class RiotAPIModule {
    private key?: string;

    constructor(options: ConfigInterface['riot-api']) {
        this.key = options.key;
    }

    /**
     * @private
     *
     * @param template A list of string templates that are filled in with parameters.
     * @param match Parameters to fill in variables for the string templates.
     * @returns Substituted version of template with parameter values from match.
     */
    private static generateTemplateString(template: string, match: Record<string, unknown>): string {
        try {
            // Encode the components of the target URL (using values from the payload)
            return _.template(template)(_.mapValues(match, (v) => {
                if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
                    return encodeURIComponent(v);
                }
                return v;
            }));
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`[galeforce]: Action payload ${e.message.split(' ')[0]} is required but undefined.`);
            } else {
                throw new Error('[galeforce]: Failed to generate URL from template string.');
            }
        }
    }

    /**
     * Returns a general Riot API `Request` object, with the provided API key as a header.
     *
     * @param stringTemplate The URL string template to substitute `parameters` into.
     * @param parameters The parameters to substitute into the URL `stringTemplate`.
     * @param query The query to send along with the request.
     * @param body The body of the request.
     * @returns a `Request` object.
     */
    public request(stringTemplate: string, parameters: Record<string, unknown>, query: object = {}, body: object = {}): Request {
        return new Request(RiotAPIModule.generateTemplateString(stringTemplate, parameters), body, {
            params: query,
            headers: this.key ? { 'X-Riot-Token': this.key } : {},
        });
    }

    /**
     * Returns a `Request` object with a custom `https.Agent` containing the Riot Game Client SSL certificate chain.
     *
     * @param stringTemplate The URL string template to substitute `parameters` into.
     * @param parameters The parameters to substitute into the URL `stringTemplate`.
     * @param query The query to send along with the request.
     * @param body The body of the request.
     * @returns a `Request` object.
     */
    public gcRequest(stringTemplate: string, parameters: Record<string, unknown>, query: object = {}, body: object = {}): Request {
        return new Request(RiotAPIModule.generateTemplateString(stringTemplate, parameters), body, {
            params: query,
            httpsAgent,
        });
    }

    /**
     * Returns a `Request` object that provides the fetched data as an `ArrayBuffer`.
     *
     * @param stringTemplate The URL string template to substitute `parameters` into.
     * @param parameters The parameters to substitute into the URL `stringTemplate`.
     * @param query The query to send along with the request.
     * @param body The body of the request.
     * @returns a `Request` object.
     */
    public bufferRequest(stringTemplate: string, parameters: Record<string, unknown>, query: object = {}, body: object = {}): Request {
        return new Request(RiotAPIModule.generateTemplateString(stringTemplate, parameters), body, {
            params: query,
            responseType: 'arraybuffer',
        });
    }
}

export {
    ENDPOINTS, Region, LeagueRegion, RiotRegion, ValorantRegion, DataDragonRegion, LorRegion,
    Queue, LeagueQueue, ValorantQueue, Tier, Division, Game,
};
