// import { createServerClient } from "@supabase/ssr";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const path: string = body?.path as string;

//     if (path) {
//       revalidatePath(path);
//       return new Response(JSON.stringify({ message: `Revalidated ${path}` }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       return new Response(JSON.stringify({ message: "No path!" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     return new Response(
//       JSON.stringify({ message: "Error revalidating path" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }
// }
