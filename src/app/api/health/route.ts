import { NextResponse } from "next/server";

export const GET = async () => {
  const checks = {
    env: {
      NEO4J_URI: process.env.NEO4J_URI ? "✓ set" : "✗ missing",
      NEO4J_USERNAME: process.env.NEO4J_USERNAME ? "✓ set" : "✗ missing",
      NEO4J_PASSWORD: process.env.NEO4J_PASSWORD ? "✓ set" : "✗ missing",
      NEO4J_DATABASE: process.env.NEO4J_DATABASE || "(default: neo4j)",
      AURA_INSTANCEID: process.env.AURA_INSTANCEID || "(not set)",
    },
    neo4j: { connectivity: "checking..." as string, details: {} as Record<string, any> },
  };

  // Test direct Neo4j connectivity
  try {
    const neo4j = require("neo4j-driver");
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USERNAME;
    const pass = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !pass) {
      checks.neo4j.connectivity = "✗ missing credentials";
      checks.neo4j.details = { reason: "Missing NEO4J_URI, NEO4J_USERNAME, or NEO4J_PASSWORD" };
      return NextResponse.json(checks, { status: 503 });
    }

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, pass), {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 5000,
      maxTransactionRetryTime: 3000,
      disableLosslessIntegers: true,
    });

    // Test connectivity
    const start = Date.now();
    await driver.verifyConnectivity();
    const latency = Date.now() - start;

    checks.neo4j.connectivity = "✓ connected";
    checks.neo4j.details = { latency_ms: latency, driver_version: driver._driverMetrics?.serverVersion || "unknown" };

    // Try a simple query
    const session = driver.session();
    try {
      const result = await session.run("RETURN 1 as test");
      checks.neo4j.details.query = "✓ simple query succeeded";
    } catch (e) {
      checks.neo4j.details.query = `✗ query failed: ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      await session.close();
    }

    await driver.close();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    checks.neo4j.connectivity = "✗ error";
    checks.neo4j.details = { error: message };
    return NextResponse.json(checks, { status: 503 });
  }

  return NextResponse.json(checks, { status: 200 });
};
