import neo4j, { Driver, Integer, Session } from "neo4j-driver";

let cachedDriver: Driver | null = null;

export class Neo4jConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Neo4jConfigurationError";
  }
}

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Neo4jConfigurationError(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getNeo4jDriver(): Driver {
  if (cachedDriver) {
    return cachedDriver;
  }

  const uri = requiredEnv("NEO4J_URI");
  const user = requiredEnv("NEO4J_USERNAME");
  const password = requiredEnv("NEO4J_PASSWORD");

  cachedDriver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 5000,
    maxTransactionRetryTime: 3000,
    disableLosslessIntegers: true,
  });
  return cachedDriver;
}

export function getSession(mode: "READ" | "WRITE" = "READ"): Session {
  const configuredDatabase = process.env.NEO4J_DATABASE?.trim();
  const auraInstanceId = process.env.AURA_INSTANCEID?.trim();
  const shouldUseConfiguredDatabase =
    Boolean(configuredDatabase) && (!auraInstanceId || configuredDatabase !== auraInstanceId);

  return getNeo4jDriver().session({
    ...(shouldUseConfiguredDatabase ? { database: configuredDatabase } : {}),
    defaultAccessMode: mode === "WRITE" ? neo4j.session.WRITE : neo4j.session.READ,
  });
}

export function toNumber(value: unknown): number {
  if (neo4j.isInt(value)) {
    return (value as Integer).toNumber();
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function toStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .map((item) => (typeof item === "string" ? item : String(item || "")))
    .map((item) => item.trim())
    .filter(Boolean);
}
