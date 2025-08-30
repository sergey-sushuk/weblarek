import { ApiPostMethods } from "../../types";
import { IApi } from "../../types";


export class ApiComposition implements IApi {
  private readonly instanceApi: IApi;

  constructor(instanceApi: IApi) {
    this.instanceApi = instanceApi;
  }

  public get<T extends object>(uri: string): Promise<T> {
    return this.instanceApi.get<T>(uri);
  }

  public post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T> {
    return this.instanceApi.post<T>(uri, data, method);
  }
}
