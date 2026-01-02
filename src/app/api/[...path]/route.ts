
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

        const response = await fetch(url, {
            method: request.method,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body,
        });

        console.log(`[Proxy] Response Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Proxy] Error Response Body: ${errorText}`);
            return new NextResponse(errorText, { status: response.status, headers: { "Content-Type": "application/json" } });
        }

        const data = await response.blob();
        return new NextResponse(data, {
            status: response.status,
            headers: response.headers,
        });

    } catch (error) {
        console.error("[Proxy] Request Failed:", error);
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH };
