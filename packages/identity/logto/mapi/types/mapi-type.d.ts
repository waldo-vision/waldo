interface LogtoRole {
  tenantId: string;
  id: string;
  name: string;
  description: string;
  type: string;
  usersCount: number;
  featuredUsers: Array;
  applicationsCount: number;
  featuredApplications: Array;
}

export { LogtoRole };
