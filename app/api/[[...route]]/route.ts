import api from "@/server";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

const handler = (req: Request) => api.fetch(req);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
