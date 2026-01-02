
import { NextRequest, NextResponse } from "next/server";

const API_Base_URL = "https://b5lyokdfcqlxmvfo4akf4b5sga0jeqlo.lambda-url.sa-east-1.on.aws/api";

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const pathString = path.join("/");
    const url = `${API_Base_URL}/${pathString}${request.nextUrl.search}`;
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
        console.error("[Proxy] API_KEY is missing in environment variables.");
        return NextResponse.json({ error: "Configuration Error: Missing API_KEY" }, { status: 500 });
    }

    console.log(`[Proxy] Forwarding ${request.method} to: ${url}`);
    console.log(`[Proxy] Using Key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)} (Length: ${apiKey.length})`);

    try {
        const body = request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined;

        const fetchOptions: RequestInit = {
            method: request.method,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body,
        };

        // Cache GET requests for 60 seconds to protect AWS costs
        if (request.method === "GET") {
            fetchOptions.next = { revalidate: 60 };
        }

        const response = await fetch(url, fetchOptions);

        console.log(`[Proxy] Response Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Proxy] Error Response Body: ${errorText}`);
            return new NextResponse(errorText, { status: response.status, headers: { "Content-Type": "application/json" } });
        }

        const data = await response.blob();

        const responseHeaders = new Headers(response.headers);
        if (request.method === "GET") {
            // Browser cache for 1 minute, shared cache (CDN) for 1 minute
            responseHeaders.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
        }

        return new NextResponse(data, {
            status: response.status,
            headers: responseHeaders,
        });

    } catch (error) {
        console.error("[Proxy] Request Failed:", error);
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH };
