import { NextResponse } from "next/server";
import { Neo4jConfigurationError } from "@/lib/neo4j";

type AnyRouteHandler = (...args: any[]) => Promise<NextResponse>;

function messageFromError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Internal server error";
}

export function toApiErrorResponse(error: unknown): NextResponse {
  const rawMessage = messageFromError(error);
  const message = process.env.NODE_ENV === "development" ? rawMessage : "Request failed";

  let status = 500;
  let code = "INTERNAL_ERROR";

  if (error instanceof Neo4jConfigurationError) {
    status = 503;
    code = "DB_CONFIG_ERROR";
  } else if (error instanceof SyntaxError) {
    status = 400;
    code = "INVALID_JSON";
  } else if (
    rawMessage.includes("ServiceUnavailable") ||
    rawMessage.includes("connection") ||
    rawMessage.includes("timed out") ||
    rawMessage.includes("No routing servers available")
  ) {
    status = 503;
    code = "DB_UNAVAILABLE";
  }

  console.error("API route failed", error);

  return NextResponse.json(
    {
      error: message,
      code,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export function withApiHandler<T extends AnyRouteHandler>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return toApiErrorResponse(error);
    }
  }) as T;
}

export function publicCacheHeaders(seconds = 60, staleSeconds = 300): HeadersInit {
  return {
    "Cache-Control": `public, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`,
  };
}
