import { DuneClient } from "@duneanalytics/client-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const api = process.env.DUNE_API_KEY;
    if(!api) {
        return NextResponse.error();
    }
    const dune = new DuneClient(api);
    const failTx = await dune.getLatestResult({ queryId: 3696980 });
    

    return NextResponse.json({failTx});
}