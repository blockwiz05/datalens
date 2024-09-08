import { DuneClient } from "@duneanalytics/client-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const api = process.env.DUNE_API_KEY;
    if(!api) {
        return NextResponse.error();
    }
    const dune = new DuneClient(api);
    const total_validator = await dune.getLatestResult({ queryId: 3604827 });
    const sevenDay_validator = await dune.getLatestResult({ queryId: 3625698 });

    const total_operators = await dune.getLatestResult({ queryId: 3605519 });
    

    const validator = {total_validator, sevenDay_validator};
    const operators = {total_operators};

    return NextResponse.json({validator, operators});
}