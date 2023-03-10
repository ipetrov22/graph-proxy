import request from 'graphql-request';

import { pairsQuery } from '../queries/pair';
import { poolsQuery } from '../queries/pool';
import { Pair, PairsArgs } from '../schema/pair';
import { getEnvVariable } from '../utils/getEnvVariable';
import { convertV3PoolToV2Pair, pairPoolProps } from '../utils/parsing';

export async function getV2Pairs(args: PairsArgs): Promise<Pair[]> {
  const url = getEnvVariable('V2_GRAPH_ENDPOINT');
  const data = await request(url, pairsQuery, args);
  return data.pairs ? data.pairs : [];
}

export async function getV3Pools(args: PairsArgs): Promise<Pair[]> {
  if (args.orderBy) {
    args.orderBy = pairPoolProps[args.orderBy] ?? args.orderBy;
  }

  const url = getEnvVariable('V3_GRAPH_ENDPOINT');
  const data = await request(url, poolsQuery, args);

  if (data.pools) {
    return data.pools.map(convertV3PoolToV2Pair);
  }

  return [];
}
