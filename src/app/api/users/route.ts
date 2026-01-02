
import { NextRequest, NextResponse } from "next/server";

const API_Base_URL = "https://b5lyokdfcqlxmvfo4akf4b5sga0jeqlo.lambda-url.sa-east-1.on.aws/api";

export async function POST(request: NextRequest) {
    const url = `${API_Base_URL}/users`;
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
        console.error("[Proxy/Users] API_KEY is missing.");
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    try {
        const body = await request.text();
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body,
        });

        if (!response.ok) {
            console.error(`[Proxy/Users] POST Error: ${response.status}`);
            return new NextResponse(await response.text(), { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("[Proxy/Users] POST Request Failed:", error);
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}
