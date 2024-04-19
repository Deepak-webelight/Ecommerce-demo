export interface Iconfiguration {
  port: number;
  database: string;
  jwtSecret: string;
}
export default (): Iconfiguration => ({
  port: parseInt(process.env.PORT) || 5000,
  database: process.env.MONGODB_URL,
  jwtSecret: process.env.MONGODB_SECRET,
});
