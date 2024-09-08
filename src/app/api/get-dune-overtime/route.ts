import { DuneClient } from "@duneanalytics/client-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const api = process.env.DUNE_API_KEY;
    if(!api) {
        return NextResponse.error();
    }
    const dune = new DuneClient(api);
   const validator_overtime = await dune.getLatestResult({ queryId: 3604827 });
   const operators_overtime = await dune.getLatestResult({ queryId: 3605519 });
   
    return NextResponse.json({validator_overtime, operators_overtime});
}