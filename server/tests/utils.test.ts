import { describe, it, expect } from "vitest";
import { buildCommentTree, commentToApi, apiToComment } from "../utils";
import type { DbComment } from "../db";
import type { ApiComment, Comment } from "../types";

describe("buildCommentTree", () => {
  it("should build a tree from flat database comments", () => {
    const dbComments: DbComment[] = [
      {
        id: "1",
        text: "Root comment",
        created_at: "2049-01-01T10:00:00.000Z",
        parent_id: null,
      },
      {
        id: "2",
        text: "Reply to root",
        created_at: "2049-01-01T10:01:00.000Z",
        parent_id: "1",
      },
      {
        id: "3",
        text: "Another root comment",
        created_at: "2049-01-01T10:02:00.000Z",
        parent_id: null,
      },
      {
        id: "4",
        text: "Reply to reply",
        created_at: "2049-01-01T10:03:00.000Z",
        parent_id: "2",
      },
    ];

    const result = buildCommentTree(dbComments);

    expect(result).toHaveLength(2); // Two root comments
    expect(result[0].id).toBe("1");
    expect(result[0].replies).toHaveLength(1);
    expect(result[0].replies[0].id).toBe("2");
    expect(result[0].replies[0].replies).toHaveLength(1);
    expect(result[0].replies[0].replies[0].id).toBe("4");
    expect(result[1].id).toBe("3");
    expect(result[1].replies).toHaveLength(0);
  });

  it("should handle empty input", () => {
    const result = buildCommentTree([]);
    expect(result).toEqual([]);
  });

  it("should handle comments with missing parents", () => {
    const dbComments: DbComment[] = [
      {
        id: "1",
        text: "Orphaned reply",
        created_at: "2049-01-01T10:00:00.000Z",
        parent_id: "nonexistent",
      },
      {
        id: "2",
        text: "Root comment",
        created_at: "2049-01-01T10:01:00.000Z",
        parent_id: null,
      },
    ];

    const result = buildCommentTree(dbComments);

    expect(result).toHaveLength(1); // Only the root comment
    expect(result[0].id).toBe("2");
    expect(result[0].replies).toHaveLength(0);
  });
});

describe("commentToApi", () => {
  it("should convert Comment to ApiComment", () => {
    const comment: Comment = {
      id: "1",
      text: "Test comment",
      createdAt: new Date("2049-01-01T10:00:00.000Z"),
      parentId: "parent1",
      replies: [
        {
          id: "2",
          text: "Reply",
          createdAt: new Date("2049-01-01T10:01:00.000Z"),
          replies: [],
        },
      ],
    };

    const result = commentToApi(comment);

    expect(result.id).toBe("1");
    expect(result.text).toBe("Test comment");
    expect(result.createdAt).toBe("2049-01-01T10:00:00.000Z");
    expect(result.parentId).toBe("parent1");
    expect(result.replies).toHaveLength(1);
    expect(result.replies[0].createdAt).toBe("2049-01-01T10:01:00.000Z");
  });
});

describe("apiToComment", () => {
  it("should convert ApiComment to Comment", () => {
    const apiComment: ApiComment = {
      id: "1",
      text: "Test comment",
      createdAt: "2049-01-01T10:00:00.000Z",
      parentId: "parent1",
      replies: [
        {
          id: "2",
          text: "Reply",
          createdAt: "2049-01-01T10:01:00.000Z",
          replies: [],
        },
      ],
    };

    const result = apiToComment(apiComment);

    expect(result.id).toBe("1");
    expect(result.text).toBe("Test comment");
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe("2049-01-01T10:00:00.000Z");
    expect(result.parentId).toBe("parent1");
    expect(result.replies).toHaveLength(1);
    expect(result.replies[0].createdAt).toBeInstanceOf(Date);
  });

  it("should handle missing parentId", () => {
    const apiComment: ApiComment = {
      id: "1",
      text: "Test comment",
      createdAt: "2049-01-01T10:00:00.000Z",
      replies: [],
    };

    const result = apiToComment(apiComment);

    expect(result.parentId).toBeUndefined();
  });
});
