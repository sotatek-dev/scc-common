export interface IEndpointStatus {
  endpoint?: string;
  isOK: boolean;
  description?: string;
}

export interface IEndpointsStatus extends Array<IEndpointStatus> {}
