const listHelper = require("../utils/list_helpers");

describe("highest like", () => {
  const listBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      likes: 2,
    },
  ];

  test("highest like in the blogs array", () => {
    const result = listHelper.favoriteBlog(listBlogs);
    const equal = listBlogs[2];
    expect(result).toEqual(equal);
  });
});
