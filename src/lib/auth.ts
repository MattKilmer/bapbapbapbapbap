import { headers } from "next/headers";

export function isAuthenticated(): boolean {
  const headersList = headers();
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

export function requireAuth() {
  if (!isAuthenticated()) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin"',
      },
    });
  }
  return null;
}