import { headers } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  
  if (!authorization) return false;
  
  const [type, credentials] = authorization.split(" ");
  if (type !== "Basic") return false;
  
  try {
    const decoded = Buffer.from(credentials, "base64").toString();
    const [username, password] = decoded.split(":");
    
    return username === "admin" && password === process.env.ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export async function requireAuth() {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin"',
      },
    });
  }
  return null;
}