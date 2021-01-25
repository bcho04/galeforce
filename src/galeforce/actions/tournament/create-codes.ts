import { Action } from '../action';
import { ENDPOINTS, LeagueRegion } from '../../../riot-api';
import { SubmoduleMapInterface } from '../../interfaces/submodule-map';
import { TournamentCodeParameters } from '../../interfaces/parameters';
import { TakesBody, TakesQuery, TakesRegion } from '../mixins';

type PostTournamentCodesQuery = {
    count?: number;
    tournamentId: number;
}

const BaseAction = TakesBody<TournamentCodeParameters>(
    TakesQuery<PostTournamentCodesQuery>(
        TakesRegion<LeagueRegion>(
            Action,
        ),
    ),
);

export class PostTournamentCodes extends BaseAction<string[]> {
    constructor(SubmoduleMap: SubmoduleMapInterface) {
        super(SubmoduleMap);
        this.payload.endpoint = ENDPOINTS.TOURNAMENT.CODES.CREATE;
        this.payload.type = 'lol';
        this.payload.method = 'POST';
    }

    public async exec(): Promise<string[]> {
        if (!this.payload.query || !Object.keys(this.payload.query).includes('tournamentId')) {
            throw new Error('[galeforce]: POST to /lol/tournament/v4/codes requires a query with a tournamentId parameter.');
        }
        return super.exec();
    }
}