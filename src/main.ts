// src/main.ts
import { PushToGitHub } from './pushToGitHub';
import { GetOperationsAPICount, GetUsersAPIResponse, ImportOperationsAPIResponse, ImportPlacementsAPIResponse, ImportStatusAPIResponse, ImportCheckinAPIResponse, ImportCleaningsAPIResponse, ImportDelegateCleaningsAPIResponse } from './subroutine';
import { CreatePayload, GetToken } from './helper';

function main() {
  //PushToGitHub();

  const accessToken = GetToken();
  if (!accessToken)
    throw new Error('Failed to get access token');

  const sheetId = "1YvHj-CY6i64VlK4m7BMCK9cCrBHepYZG-qDec1YnFeo";
  const startDate = "2024-05-19";
  const endDate = "2024-05-19";
  const filter = "normalCleaning";
  const payloadForCount = CreatePayload({startDate}, {endDate}, {filter});

  const operationsApiCount = GetOperationsAPICount(accessToken, payloadForCount);
  const fullSizeCount = operationsApiCount.count;
  const pageSize = 1000;
  const totalPages = Math.ceil(fullSizeCount / pageSize);

  Utilities.sleep(3000); // 3秒待機
  GetUsersAPIResponse(accessToken);

  //Utilities.sleep(3000); // 3秒待機
  //ImportDelegateCleaningsAPIResponse(accessToken, sheetId, startDate, endDate)
  //ImportCleaningsAPIResponse(accessToken, sheetId, startDate, endDate);
  /*Utilities.sleep(3000); // 3秒待機
  ImportOperationsAPIResponse(accessToken, sheetId, totalPages, pageSize, startDate, endDate, filter);
  Utilities.sleep(3000); // 3秒待機
  ImportPlacementsAPIResponse(accessToken, sheetId);
  Utilities.sleep(3000); // 3秒待機
  ImportCheckinAPIResponse(accessToken, sheetId);
  Utilities.sleep(3000); // 3秒待機*/

  //ImportStatusAPIResponse(accessToken, sheetId);
  //Utilities.sleep(3000); // 3秒待機
}
