
import { NextRequest, NextResponse } from "next/server";

const API_Base_URL = "https://b5lyokdfcqlxmvfo4akf4b5sga0jeqlo.lambda-url.sa-east-1.on.aws/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    const { spaceId } = await params;

    // Construct the correct URL: /api/labels/space/:spaceId
    const url = `${API_Base_URL}/labels/space/${spaceId}`;
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
        console.error("[Proxy/Labels] API_KEY is missing.");
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    console.log(`[Proxy/Labels] Forwarding GET to: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });

        if (!response.ok) {
            console.error(`[Proxy/Labels] Error: ${response.status}`);
            return new NextResponse(await response.text(), { status: response.status });
        }

        const labelsList = await response.json();

        // Hydrate labels with details (specifically color) from individual endpoints
        // because the list endpoint returns incomplete data.
        if (Array.isArray(labelsList)) {
            const detailedLabels = await Promise.all(labelsList.map(async (label: any) => {
                try {
                    const detailResponse = await fetch(`${API_Base_URL}/labels/${label.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": apiKey,
                        },
                    });

                    if (detailResponse.ok) {
                        const detailData = await detailResponse.json();
                        // Merge detail data (which has 'color') with list data
                        return { ...label, ...detailData };
                    }
                    return label;
                } catch (e) {
                    console.error(`[Proxy/Labels] Failed to hydrate label ${label.id}`, e);
                    return label;
                }
            }));
            return NextResponse.json(detailedLabels);
        }

        return NextResponse.json(labelsList);

    } catch (error) {
        console.error("[Proxy/Labels] Request Failed:", error);
        return NextResponse.json({ error: "Proxy Request Failed" }, { status: 500 });
    }
}
