describe('sum', function () {
  it('adds 2 - 1 to equal 1', function () {
    expect(sum(2, -1)).toBe(1);
  });
  it('adds 1 + 2 to equal 3', function () {
    expect(sum(1, 2)).toBe(3);
  });
});