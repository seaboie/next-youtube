import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { NextResponse } from "next/server"

export const GET = async () => {

    try {
        await connect();

        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch (err: unknown) {
        console.error(`🔥 🔥 🔥 🔥 🔥 Oops !!! : Have error `, err);
        if (err instanceof Error) {
            return new NextResponse("Instance of : Error fetching users " + err.message, {status: 500});
        } else {
            return new NextResponse("Have error " + err);
        }
    }
}