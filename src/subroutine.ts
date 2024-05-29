import { CallApi, CreatePayload, FlattenObject, OutputJsonToSheet, TransformData, TransformCheckinData, GetColumnDataByHeader } from './helper';

export function GetOperationsAPICount(accessToken: string, payloadForCount: Record<string, any>): { count: number } {
  const countApiUrl = "https://api-cleaning.m2msystems.cloud/v4/operations/count";
  const apiResponse = CallApi(accessToken, countApiUrl, "post", payloadForCount);
  return apiResponse;
}

export function GetUsersAPIResponse(accessToken: string): any {
  const usersApiUrl = "https://api.m2msystems.cloud/users/find_by_company_id?statuses=Active";
  const jsonData = CallApi(accessToken, usersApiUrl, "get");
  return jsonData;
}

export function ImportOperationsAPIResponse(accessToken: string, sheetId: string, totalPages: number, pageSize: number, startDate: string, endDate: string, filter: string): void {
  const operationsApiUrl = "https://api-cleaning.m2msystems.cloud/v4/operations/search";

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const isCurrentPage1 = (currentPage === 1);
    const payloadForOperations = CreatePayload({startDate}, {endDate}, {filter}, {page: currentPage}, {pageSize});
    const jsonData = CallApi(accessToken, operationsApiUrl, "post", payloadForOperations);

    OutputJsonToSheet(jsonData, sheetId, "operations", isCurrentPage1);
  }
}

export function ImportPlacementsAPIResponse(accessToken: string, sheetId: string): void {
  const placementsApiUrl = "https://api-cleaning.m2msystems.cloud/v4/placements/find_by_ids";

  const placementIds = GetColumnDataByHeader("placementId", sheetId, "operations");
  const payloadForPlacements = CreatePayload({placementIds});

  const jsonData = CallApi(accessToken, placementsApiUrl, "post", payloadForPlacements);
  const flatData = jsonData.placements.map((item: Record<string, any>) => FlattenObject(item));

  OutputJsonToSheet(flatData, sheetId, "placements");
}

export function ImportStatusAPIResponse(accessToken: string, sheetId: string): void {
  const statusApiUrl = "https://api-cleaning.m2msystems.cloud/v4/cleaning/status";

  const cleaningIds = GetColumnDataByHeader("id", sheetId, "operations");
  const payloadForStatus = CreatePayload({cleaningIds});

  const jsonData = CallApi(accessToken, statusApiUrl, "post", payloadForStatus);
  const transformedData = TransformData(jsonData, "cleaningId", "status");

  OutputJsonToSheet(transformedData, sheetId, "status");
}

export function ImportCheckinAPIResponse(accessToken: string, sheetId: string): void {
  const placementsApiUrl = "https://api-cleaning.m2msystems.cloud/v4/cleanings/checkin";

  const cleaningIds = GetColumnDataByHeader("id", sheetId, "operations");
  const payloadForCleanings = CreatePayload({cleaningIds});

  const jsonData = CallApi(accessToken, placementsApiUrl, "post", payloadForCleanings);
  const transformedData = TransformCheckinData(jsonData);

  OutputJsonToSheet(transformedData, sheetId, "checkin");
}

export function ImportCleaningsAPIResponse(accessToken: string, sheetId: string, startDate: string, endDate: string): void {
  const cleaningsApiUrl = "https://api-cleaning.m2msystems.cloud/v4/search/cleanings";

  const payloadForCleanings = CreatePayload({startDate}, {endDate});
  const jsonData = CallApi(accessToken, cleaningsApiUrl, "post", payloadForCleanings);

  OutputJsonToSheet(jsonData, sheetId, "cleanings");
}

export function ImportDelegateCleaningsAPIResponse(accessToken: string, sheetId: string, startDate: string, endDate: string): void {
  const delegateCleaningsApiUrl = "https://api-cleaning.m2msystems.cloud/v3/search/delegate_cleanings";

  const payloadFordelegateCleanings = CreatePayload({startDate}, {endDate});
  const jsonData = CallApi(accessToken, delegateCleaningsApiUrl, "post", payloadFordelegateCleanings);

  OutputJsonToSheet(jsonData, sheetId, "delegate_cleanings");
}
