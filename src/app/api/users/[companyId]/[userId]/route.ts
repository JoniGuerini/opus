
import { NextRequest, NextResponse } from "next/server";

const API_Base_URL = "https://b5lyokdfcqlxmvfo4akf4b5sga0jeqlo.lambda-url.sa-east-1.on.aws/api";

// GET: Get User Details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ companyId: string; userId: string }> }
) {
    const { companyId, userId } = await params;
    const url = `${API_Base_URL}/users/${companyId}/${userId}`;
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });

        if (!response.ok) {
            console.error(`[Proxy/Users] GET Detail Error: ${response.status}`);
            return new NextResponse(await response.text(), { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}

// PUT: Update User
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ companyId: string; userId: string }> }
) {
    const { companyId, userId } = await params;
    const url = `${API_Base_URL}/users/${companyId}/${userId}`;
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    try {
        const body = await request.text();
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body,
        });

        if (!response.ok) {
            console.error(`[Proxy/Users] PUT Error: ${response.status}`);
            return new NextResponse(await response.text(), { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}

// DELETE: Delete User
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ companyId: string; userId: string }> }
) {
    const { companyId, userId } = await params;
    const url = `${API_Base_URL}/users/${companyId}/${userId}`;
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });

        if (!response.ok) {
            console.error(`[Proxy/Users] DELETE Error: ${response.status}`);
            return new NextResponse(await response.text(), { status: response.status });
        }

        // Return 200/204 depending on upstream, but Next.json needs data or null
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}
