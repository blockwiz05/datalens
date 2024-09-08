import { DuneClient } from "@duneanalytics/client-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const api = process.env.DUNE_API_KEY;
    if(!api) {
        return NextResponse.error();
    }
    const dune = new DuneClient(api);
    const ssv_holders = await dune.getLatestResult({ queryId: 2967498 });
    const ssv_treasury = await dune.getLatestResult({ queryId: 3082005 });

    return NextResponse.json({ssv_holders, ssv_treasury});
}