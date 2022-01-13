const palindrome = require("../utils/for_testing").palindrome;
const listHelper = require("../utils/list_helpers");
const average = require("../utils/for_testing").average;

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has multiple blog, the total likes is ", () => {
    const result = listHelper.totalLikes(listHelper.initialBlogs);
    expect(result).toBe(36);
  });
});

describe("Test of Palindrome exercise", () => {
  test("palindrome of a", () => {
    const result = palindrome("a");

    expect(result).toBe("a");
  });

  test("palindrome of react", () => {
    const result = palindrome("react");

    expect(result).toBe("tcaer");
  });

  test("palindrome of releveler", () => {
    const result = palindrome("releveler");

    expect(result).toBe("releveler");
  });
})

describe("Test of average exercise", () => {
  test("of one value is the value itself", () => {
    expect(average([1])).toBe(1);
  });

  test("of many is calculated right", () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });

  test("of empty array is zero", () => {
    expect(average([])).toBe(0);
  });
});
