interface V2Session {
  logto_id: string;
  id: string;
  provider: string;
  providerId: string | number;
  name: string;
  image: string;
  logto_username: string;
  blacklisted: boolean;
  scope: Array<string>;
  hasScope: (requiredScope: Array<string>) => boolean;
}

export { V2Session };
