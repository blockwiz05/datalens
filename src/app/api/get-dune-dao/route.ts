import { DuneClient } from "@duneanalytics/client-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const api = process.env.DUNE_API_KEY;
    if(!api) {
        return NextResponse.error();
    }
    const dune = new DuneClient(api);
   const ssv_price = await dune.getLatestResult({ queryId: 2966882 });
   const ssv_sevenday_volume= await dune.getLatestResult({ queryId: 2966929 });
   const ssv_valuation = await dune.getLatestResult({ queryId: 2966861 });
    const ssv_supply = await dune.getLatestResult({ queryId: 2965425 });    
   
    return NextResponse.json({ssv_price, ssv_sevenday_volume, ssv_valuation, ssv_supply});
}