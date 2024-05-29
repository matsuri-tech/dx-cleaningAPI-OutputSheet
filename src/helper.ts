// src/helper.ts
export function CreatePayload(...args: Record<string, any>[]): Record<string, any> {
  let payload: Record<string, any> = {};
  args.forEach(function (arg) {
    for (let key in arg)
      if (arg.hasOwnProperty(key))
        payload[key] = arg[key];
  });
  return payload;
}
  
export function TransformData(data: Record<string, any>, keyName1: string, keyName2: string): Record<string, any>[] {
  let transformedData: Record<string, any>[] = [];
  for (let key in data)
    if (data.hasOwnProperty(key)) {
      let newObject: Record<string, any> = {};
      newObject[keyName1] = key;
      newObject[keyName2] = data[key];
      transformedData.push(newObject);
    }
  return transformedData;
}
  
export function TransformCheckinData(data: Record<string, any>): Record<string, any>[] {
  let transformedData: Record<string, any>[] = [];
  for (let key in data)
    if (data.hasOwnProperty(key))
      transformedData.push({
        cleaningId: key,
        hasCheckinOnDate: data[key].hasCheckinOnDate
      });
  return transformedData;
}
  
export function FlattenObject(obj: Record<string, any>, parent: string = '', res: Record<string, any> = {}): Record<string, any> {
  for (let key in obj) {
    let propName = parent ? parent + '.' + key : key;
    if (typeof obj[key] == 'object' && obj[key] !== null) {
      FlattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

export function OutputJsonToSheet(jsonData: Record<string, any>[], sheetId: string, sheetName: string, isCurrentPage1: boolean = true): void {
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet with name ' + sheetName + ' does not exist in the spreadsheet.');
    
  const keys = Object.keys(jsonData[0]);
  const startRow = (isCurrentPage1) ? 1 : sheet.getLastRow() + 1;
    
  if (isCurrentPage1) {
    sheet.clear();
    for (let i = 0; i < keys.length; i++)
      sheet.getRange(1, i + 1).setValue(keys[i]);
  }
    
  for (let row = 0; row < jsonData.length; row++)
    for (let col = 0; col < keys.length; col++)
      sheet.getRange(startRow + row + 1, col + 1).setValue(jsonData[row][keys[col]]);
}
  
export function CallApi(accessToken: string, apiUrl: string, method: 'get' | 'delete' | 'patch' | 'post' | 'put', payload: object | null = null, authHeader: string = 'Bearer '): any {
  const headers = {
    'Authorization': authHeader + accessToken,
    'Content-Type': 'application/json'
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    'method': method,
    'headers': headers
  };
  if (payload) options.payload = JSON.stringify(payload);
    
  const response = UrlFetchApp.fetch(apiUrl, options);
  return JSON.parse(response.getContentText());
}
  
export function GetToken(): string | null {
  const scriptProperties = PropertiesService.getScriptProperties();
  const storedAccessToken = scriptProperties.getProperty('accessToken');
  const storedExpiresAt = scriptProperties.getProperty('expiresAt');
  
  if (storedAccessToken && storedExpiresAt) {
    const currentTime = Math.floor(Date.now() / 1000); // 現在のUnixエポック時間を取得
    if (currentTime < parseInt(storedExpiresAt)) return storedAccessToken; // 既存のトークンを返す
  }
    
  const email = scriptProperties.getProperty('email');
  const password = scriptProperties.getProperty('password');
  const loginUrl = "https://api.m2msystems.cloud/login";
  const payload = {
    'email': email,
    'password': password
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  try {
    const response = UrlFetchApp.fetch(loginUrl, options);
    if (response.getResponseCode() == 200) {
      const jsonResponse = JSON.parse(response.getContentText());
      const accessToken = jsonResponse.accessToken;
      const expiresAt = Math.floor(jsonResponse.expiresAt / 1000);
      scriptProperties.setProperty('accessToken', accessToken);
      scriptProperties.setProperty('expiresAt', expiresAt.toString()); // 文字列として保存
      return accessToken; // 新しいトークンを返す
    } else {
      Logger.log('トークンの取得に失敗しました。ステータスコード：' + response.getResponseCode());
      return null;
    }
  } catch (error) {
    Logger.log('トークン取得時にエラーが発生しました: ' + (error as Error).toString());
    return null;
  }
}  
  
export function GetColumnDataByHeader(searchString: string, sheetId: string, sheetName: string): string[] | null {
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) return null;
    
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const columnIndex = headers.indexOf(searchString);
  if (columnIndex === -1) return null;
    
  const columnData = sheet.getRange(2, columnIndex + 1, sheet.getLastRow() - 1, 1).getValues();
  const dataList = columnData.map(function(row) {
    return row[0];
  });
  return dataList;
}
  
export function CreateQueryString(params: { [key: string]: string }): string {
  return Object.keys(params)
    .map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    })
    .join('&');
}