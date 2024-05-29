// src/pushToGitHub.ts
import { CreateQueryString } from './helper';

export function PushToGitHub(): void {
  const url = "https://asia-northeast1-m2m-core.cloudfunctions.net/kanetsuna_gas_push_github";
  const scriptId = ScriptApp.getScriptId();
  const scriptProperties = PropertiesService.getScriptProperties();
  const githubToken = scriptProperties.getProperty('githubToken');
  const githubRepo = 'matsuri-tech/dx-cleaningAPI-OutputSheet';

  if (!githubToken)
    throw new Error('GitHub token is not set');

  const params = {
    script_id: scriptId,
    github_token: githubToken,
    github_repo: githubRepo
  };
  const sendUrl = url + '?' + CreateQueryString(params);
  UrlFetchApp.fetch(sendUrl, {
    method: 'get'
  });
}
