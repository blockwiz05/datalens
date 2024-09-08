import { DuneClient } from "@duneanalytics/client-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const api = process.env.DUNE_API_KEY;
    if(!api) {
        return NextResponse.error();
    }
    const dune = new DuneClient(api);
   const validator_mom = await dune.getLatestResult({ queryId: 3793600 });
   const operators_mom = await dune.getLatestResult({ queryId: 3792778 });
   const validator_qoq = await dune.getLatestResult({ queryId: 3793445 });
   const operators_qoq = await dune.getLatestResult({ queryId: 3793646 });
   
const validator = {validator_mom, validator_qoq};   
const operators = {operators_mom, operators_qoq};
const network_entities = await dune.getLatestResult({ queryId: 3801020 });

    return NextResponse.json({validator, operators,network_entities});
}