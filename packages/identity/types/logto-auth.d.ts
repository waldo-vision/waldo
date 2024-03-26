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
  hasScope?: (requiredScope: Array<string>) => boolean;
  roles: Role[];
}

interface Role {
  tenantId: string;
  id: string;
  name: string;
  description: string;
  type: string;
}

export { V2Session, Role };
