import { redisClient } from '../app';
import { 
  getSwgohHelpUnitsList, 
  getSwgohHelpUnitsListFromApi, 
  getSwgohPlayerRoster, 
  UnitListRecord, 
  updateSwgohHelpUnitsListCache
} from '../data-sources/swgoh-help-api';

export const getUnitsList = async (): Promise<UnitListRecord> => {
  await redisClient.connect();
  const unitsList: UnitListRecord = await getSwgohHelpUnitsList();
  await redisClient.quit();

  return unitsList;
};

export const refreshUnitsList = async () => {
  const unitsList = await getSwgohHelpUnitsListFromApi();
  updateSwgohHelpUnitsListCache(unitsList);
};

export const getPlayerRoster = async (allyCode: string) => {
  await redisClient.connect();
  const playerRoster = await getSwgohPlayerRoster(allyCode);
  await redisClient.quit();

  return playerRoster;
};

