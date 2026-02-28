/**
 * bem 命名生成函数
 * @param b block
 * @param e element
 * @param m modify
 */
function bem(b: string, e?: string, m?: string) {
  let result: string = b;
  if (e) result += '__' + e;
  if (m) result += '--' + m;

  return result;
}

const genBlock = (blockName: string) => {
  /**
   * ```ts
   * block('element', 'modify')
   * // 返回结果 blockName__element--modify
   * ```
   */
  function block(e?: string, m?: string) {
    return bem(blockName, e, m);
  }

  return {
    block,
  };
};

export { bem, genBlock };
