import { Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
const RANDOM_DATA_BASE_URL = "https://random-data-api.com/api";

export default function callApi(
  endpoint: string,
  method: string,
  headers?: object
): Observable<AjaxResponse<any>> {
  return ajax({
    url: `${RANDOM_DATA_BASE_URL}${endpoint}`,
    method,
    headers,
  });
}
