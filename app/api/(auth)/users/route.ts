import { NextResponse } from "next/server"

export const GET = () => {
    return new NextResponse("Hello Next JS", {status: 200});
}