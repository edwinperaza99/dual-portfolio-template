import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	try {
		const { body, isValidSignature } = await parseBody<{
			_type: string;
			slug?: string;
		}>(req, process.env.NEXT_PUBLIC_SANITY_HOOK_SECRET);

		if (!isValidSignature) {
			return new Response("Invalid Signature", { status: 401 });
		}

		if (!body?._type) {
			return new Response("Bad Request", { status: 400 });
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));

		// In Next.js 16, revalidateTag requires a cache profile parameter
		// "max" profile ensures immediate invalidation (expiry: 0 behavior)
		await revalidateTag("global-sanity", "expiry:0");

		console.log("Revalidated everything via global-sanity tag");

		return NextResponse.json({
			status: 200,
			revalidated: true,
			now: Date.now(),
			body,
		});
	} catch (error: unknown) {
		console.error(error);
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		return new Response(errorMessage, { status: 500 });
	}
}
