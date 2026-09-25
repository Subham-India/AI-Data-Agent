export type DatabaseConnectionRequest = {
  database_url: string;
};

export type DatabaseConnectionResponse = {
  success: boolean;
  database_id: string;
  message: string;
};
