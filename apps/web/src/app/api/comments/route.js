import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id") || searchParams.get("postId");

  if (!postId) {
    return Response.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const comments = await sql`
      SELECT 
        c.*,
        up.name as user_name,
        up.username,
        up.level
      FROM public.comments c
      JOIN public.user_profiles up ON c.user_id = up.user_id
      WHERE c.post_id = ${postId}
      ORDER BY c.created_at ASC
    `;

    // Build nested structure
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;
      if (!comment.parent_id) {
        rootComments.push(comment);
      } else if (commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].replies.push(comment);
      }
    });

    return Response.json({ comments: rootComments });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return Response.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const jwt = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL.startsWith("https"),
  });

  if (!jwt?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { post_id, postId, content, parent_id, parentId } = body;
    const finalPostId = post_id || postId;
    const finalParentId = parent_id || parentId;
    const userId = jwt.sub;

    if (!finalPostId || !content) {
      return Response.json(
        { error: "Post ID and content are required" },
        { status: 400 },
      );
    }

    const [newComment] = await sql`
      INSERT INTO public.comments (post_id, user_id, content, parent_id)
      VALUES (${finalPostId}, ${userId}, ${content}, ${finalParentId || null})
      RETURNING *
    `;

    // Award Community XP for commenting
    await sql`
      UPDATE public.user_profiles
      SET core_xp = core_xp + 10,
          community_xp = community_xp + 10
      WHERE user_id = ${userId}
    `;

    return Response.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("Create comment error:", error);
    return Response.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
