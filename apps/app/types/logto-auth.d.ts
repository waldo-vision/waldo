interface V2Session {
  logto_id: string;
  provider: string;
  providerId: string | number;
  name: string;
  image: string;
  logto_username: string;
  blacklisted: boolean;
}

export { V2Session };
