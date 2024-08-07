import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        await connect();

        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch (err: unknown) {
        return nextResponseApiError(err, "Error fetching users... ", 500);
    }
}