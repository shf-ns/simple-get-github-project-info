/**
 * 处理HTML字符串，提取包含所需信息的HTML部分
 * @param {string} htmlstr HTML字符串
 * @returns {string[][]}包含所有所需信息的HTML部分数组
 */
function handleHtml(htmlstr: string): string[][] {
  //----------截取包含所需信息的HTML部分-------------
  const results: string[] = [];
  let startIndex: number = 0;

  while (startIndex < htmlstr.length) {
    //找头部
    const headStart: number = htmlstr.indexOf(
      '<div class="col-10 col-lg-9 d-inline-block">',
      startIndex,
    );
    if (headStart === -1) break;

    //找尾部（从头部结束位置之后开始找，防止重叠）
    const tailStrat: number =
      headStart + '<div class="col-10 col-lg-9 d-inline-block">'.length;
    const tailEnd: number = htmlstr.indexOf("</relative-time>", tailStrat);
    if (tailEnd === -1) break;

    //截取
    results.push(htmlstr.substring(headStart, tailEnd));

    //移动指针，继续找下一处
    startIndex = tailEnd + "</relative-time>".length;
  }

  const list: string[][] = results.map((item) =>
    item
      .split("\n")
      .map((item) => item.trim())
      .filter(
        (item) =>
          item !== "" &&
          item !== "</h3>" &&
          item !== "</div>" &&
          item !== "</span>" &&
          item !== "</relative-time>" &&
          item !== "</a>" &&
          item !== "</svg>" &&
          item !== "</p>",
      ),
  );
  return list;
}

/**
 * 获取仓库列表
 * @param {string[][]} list 处理后的HTML部分数组
 * @returns {string[]} 仓库列表
 */
function getRepoList(list: string[][]): string[] {
  const repoList: string[] = [];
  list.map((item) => repoList.push(item[4]?.slice(0, -4) || ""));
  return repoList;
}

/**
 * 获取语言列表
 * @param {string[][]} list 处理后的HTML部分数组
 * @returns {string[][]} 语言列表
 */
function getLangList(list: string[][]): string[][] {
  const langList: string[][] = [];
  list.map((item) =>
    langList.push(
      item
        .map((items) => {
          if (items.includes('itemprop="programmingLanguage"')) {
            return items;
          }
          return "";
        })
        .filter((item) => item !== "")
        .map((i) => i.slice(37, -7)),
    ),
  );
  return langList;
}

/**
 * 获取strat数列表
 * @param {string[][]} list 处理后的HTML部分数组
 * @returns {number[]} strat数列表
 */
function getStratList(list: string[][]): number[] {
  const stratList: number[] = [];
  const index: number[] = list
    .map((item) =>
      item.findIndex((items) => items.includes('<svg aria-label="star"')),
    )
    .map((item) => {
      if (item == -1) {
        return item;
      }
      return item + 2;
    });

  for (let i: number = 0; i < index.length; i++) {
    if (index[i] == -1) {
      stratList.push(0);
      continue;
    }
    stratList.push(parseInt(list[i]![index[i]!]!));
  }
  return stratList;
}

async function getGithubInfo(author: string): Promise<void> {
  try {
    const result: Response = await fetch(
      "https://github.com/" + author + "?page=1&tab=repositories",
    );

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    //-------------------------解析HTML----------------------------
    const htmlstr: string = await result.text();

    //---------------------处理HTML字符串---------------------------
    const list: string[][] = handleHtml(htmlstr);
    // console.log(list);

    //---------------------------获取仓库列表--------------------------------
    const repoList: string[] = getRepoList(list);
    // console.log(repoList);

    //-----------------------------获取语言列表-----------------------------
    const langList: string[][] = getLangList(list);
    // console.log(langList);

    //---------------------------获取strat数--------------------------
    const stratList: number[] = getStratList(list);
    // console.log(stratList);
  } catch (error) {
    console.log(error);
  }
}

// getGithubInfo("Moyhuai");
getGithubInfo("Roy-Jin");
// getGithubInfo("xcatliu");
// getGithubInfo("shf-ns");
