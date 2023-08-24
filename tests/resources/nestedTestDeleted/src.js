describe('sum', function () {
  const flag = true
  if (flag) {
    it('adds 1 + 2 to equal 3', function () {
      expect(sum(1, 2)).toBe(3);
    });
  }
  it('adds 1 + 2 to equal 3', function () {
    expect(sum(1, 2)).toBe(3);
  });
});
