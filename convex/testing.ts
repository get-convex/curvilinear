import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import OpenAI from "openai";
import { api, internal } from "./_generated/api";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

const convexPeople = {
  "Jamie Turner": "CEO",
  "James Cowling": "CTO",
  "Sujay Jayakar": "Chief Scientist",
  "Indy Khare": "Head of Product",
  "Gautam Gupta": "Software Engineer",
  "Nipunn Koorapati": "Software Engineer",
  "Emma Forman Ling": "Software Engineer",
  "Lee Danilek": "Software Engineer",
  "Tom Ballinger": "Software Engineer",
  "Bryan Liu": "Head of Talent",
  "Sarah Shader": "Software Engineer",
  "Rebecca Wang": "Software Engineer",
  "Ian Macartney": "Developer Experience Engineer",
  "Jordan Hunt": "Software Engineer",
  "Abhi Vaidyanatha": "Product Marketing Manager",
  "Wayne Sutton": "Head of Community and Events",
  Ari: "Software Engineer",
  "Christina Erne": "Head of Finance and People",
  "Liz Cardoza": "Office Manager",
  "Michael Cann": "Software Engineer",
  "Geoffry Song": "Software Engineer",
};

const issueResponse = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.union([
    z.literal("none"),
    z.literal("urgent"),
    z.literal("high"),
    z.literal("medium"),
    z.literal("low"),
  ]),
  status: z.union([
    z.literal("backlog"),
    z.literal("todo"),
    z.literal("in_progress"),
    z.literal("done"),
    z.literal("canceled"),
  ]),
});

export const generateMany = action({
  args: {
    numIssues: v.number(),
  },
  handler: async (ctx, args) => {
    const promises = [];
    for (let i = 0; i < args.numIssues; i++) {
      const numComments = Math.floor(Math.random() * 10) + 1;
      promises.push(ctx.runAction(api.testing.generateIssue, { numComments }));
    }
    await Promise.all(promises);
  },
});

export const generateIssue = action({
  args: {
    numComments: v.number(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI();

    const issueId = crypto.randomUUID();
    const [user, role] =
      Object.entries(convexPeople)[
        Math.floor(Math.random() * Object.keys(convexPeople).length)
      ];

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates test data for an issue tracker for Convex, a backend as a service platform. Convex includes a database, a real-time data sync engine, and a serverless function runtime. Write the issue with a light, irreverent, but highly qualified tone. Make the issues tongue-in-cheek. Don't include any greetings or salutations in the issue. Don't include any prefix (like 'Feature Request:') in the issue title.",
        },
        {
          role: "user",
          content: `Write an example issue for ${user} (${role}) at Convex for building a new feature.`,
        },
      ],
      response_format: zodResponseFormat(issueResponse, "issue"),
    });
    const issue = completion.choices[0].message.parsed;
    if (!issue) {
      throw new Error("No issue generated");
    }
    console.log("Generated issue", issue);
    await ctx.runMutation(internal.testing.insertIssue, {
      id: issueId,
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      status: issue.status,
      modified: Date.now(),
      created: Date.now(),
      kanbanorder: "",
      username: user,
    });

    let comments: string[] = [];
    for (let i = 0; i < args.numComments; i++) {
      const commentId = crypto.randomUUID();
      const [commentUser, commentRole] =
        Object.entries(convexPeople)[
          Math.floor(Math.random() * Object.keys(convexPeople).length)
        ];
      const messages = [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates test data for an issue tracker for Convex, a backend as a service platform. Convex includes a database, a real-time data sync engine, and a serverless function runtime. Write comments with a light, irreverent, but highly qualified tone. Keep the comments short (one or two sentences), and don't include greetings or saluations. Be sure to incorporate the user's perspective based on their role.",
        },
        {
          role: "user",
          content: `Let's write a new comment for ${commentUser} (${commentRole}) at Convex for the issue ${issue.title} (${issue.description}).`,
        },
      ] as ChatCompletionMessageParam[];
      for (const comment of comments) {
        messages.push({
          role: "user",
          content: `Previous comment: ${comment}`,
        });
      }
      messages.push({ role: "user", content: `New comment:` });

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: messages,
        response_format: zodResponseFormat(
          z.object({ comment: z.string() }),
          "comment",
        ),
      });
      if (!completion.choices[0].message.parsed) {
        throw new Error("No comment generated");
      }
      const { comment } = completion.choices[0].message.parsed;
      comments.push(comment);

      console.log(`Generated comment for ${commentUser}: ${comment}`);
      await ctx.runMutation(internal.testing.insertComment, {
        id: commentId,
        username: commentUser,
        body: comment,
        issue_id: issueId,
        created_at: Date.now(),
      });
    }
  },
});

export const insertIssue = internalMutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    priority: v.string(),
    status: v.string(),
    modified: v.number(),
    created: v.number(),
    kanbanorder: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("issues", args);
  },
});

export const insertComment = internalMutation({
  args: {
    id: v.string(),
    username: v.string(),
    body: v.string(),
    issue_id: v.string(),
    created_at: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", args);
  },
});
