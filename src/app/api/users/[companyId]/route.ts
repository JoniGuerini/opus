
import { NextRequest, NextResponse } from "next/server";

const API_Base_URL = "https://b5lyokdfcqlxmvfo4akf4b5sga0jeqlo.lambda-url.sa-east-1.on.aws/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ companyId: string }> }
) {
    const { companyId } = await params;
    const url = `${API_Base_URL}/users/${companyId}`;
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
        console.error("[Proxy/Users] API_KEY is missing.");
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
            console.error(`[Proxy/Users] GET List Error: ${response.status}`);
            return new NextResponse(await response.text(), { status: response.status });
        }

        const usersList = await response.json();

        // Hydrate users with details (specifically 'id') from individual endpoints because the list endpoint returns incomplete data.
        if (Array.isArray(usersList)) {
            const detailedUsers = await Promise.all(usersList.map(async (user: any) => {
                if (!user.email) return user;
                try {
                    // Try to fetch details by email to get the ID
                    const detailResponse = await fetch(`${API_Base_URL}/users/${companyId}/${user.email}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": apiKey,
                        },
                    });

                    if (detailResponse.ok) {
                        const detailData = await detailResponse.json();
                        // Merge detail data (which has 'id') with list data
                        return { ...user, ...detailData };
                    }
                    return user;
                } catch (e) {
                    console.error(`[Proxy/Users] Failed to hydrate user ${user.email}`, e);
                    return user;
                }
            }));
            return NextResponse.json(detailedUsers);
        }

        return NextResponse.json(usersList);

    } catch (error) {
        console.error("[Proxy/Users] GET List Request Failed:", error);
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}
